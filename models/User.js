const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User {
  // Create new user
  async new(email, password, name) {
    try {
      // Generate hash
      const hash = await bcrypt.hash(password, 10);

      //Insert user in database
      await knex
        .insert({ email, password: hash, name, role: 0 })
        .table("users");
    } catch (error) {
      console.log(error);
    }
  }

  // Find all users in database
  async findAll() {
    try {
      const users = await knex
        .select(["id", "email", "name", "role"])
        .table("users");
      return users;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // Find user by id in database
  async findById(id) {
    try {
      const user = await knex
        .select(["id", "email", "name", "role"])
        .table("users")
        .where({ id: id });
      if (user.length > 0) {
        return user[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  // Find user by email in database
  async findByEmail(email) {
    try {
      const user = await knex
        .select(["id", "email", "password", "name", "role"])
        .table("users")
        .where({ email: email });
      if (user.length > 0) {
        return user[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  // Return if email exists in database
  async findEmail(email) {
    try {
      const result = await knex
        .select("*")
        .from("users")
        .where({ email: email });

      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // Update user data
  async update(id, email, name, role) {
    if (!id) {
      return {
        status: false,
        error: "Id is required to edit user",
      };
    }

    const user = await this.findById(id);

    let editUser = {};

    // Check if the data are valid
    if (user) {
      if (email && email != user.email) {
        const emailExists = await this.findEmail(email);
        if (!emailExists) {
          editUser.email = email;
        } else {
          return {
            status: false,
            error: "The e-mail is already registered.",
          };
        }
      }

      if (name) {
        editUser.name = name;
      }

      if (role != undefined) {
        editUser.role = role;
      }

      try {
        await knex.update(editUser).table("users").where({ id: id });
        return {
          status: true,
        };
      } catch (error) {
        return {
          status: false,
          error: "Invalid edit fields.",
        };
      }
    } else {
      return {
        status: false,
        error: "User does not exist.",
      };
    }
  }

  // Delete user
  async delete(id) {
    const user = await this.findById(id);
    if (user) {
      try {
        await knex.delete().table("users").where({ id: id });
        return {
          status: true,
        };
      } catch (error) {
        return {
          status: false,
          error: "Unable to delete user.",
        };
      }
    } else {
      return {
        status: false,
        error: "User does not exist.",
      };
    }
  }

  // Change user password
  async changePassword(newPassword, id, token) {
    try {
      // Generate new hash password
      const hash = await bcrypt.hash(newPassword, 10);

      // Update password in database
      await knex.update({ password: hash }).table("users").where({ id: id });

      // Set token to used
      await PasswordToken.setUsed(token);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new User();
