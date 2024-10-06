const knex = require("../database/connection");
const User = require("./User");
const { v4: uuidv4 } = require("uuid");

class PasswordToken {
  // Create a new password token to recover password
  async create(email) {
    const user = await User.findByEmail(email);

    if (user) {
      try {
        // Generate token using uuid
        const token = uuidv4();
        await knex
          .insert({
            token: token,
            user_id: user.id,
            used: 0,
          })
          .table("password_tokens");
        return {
          status: true,
          token,
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          error: error,
        };
      }
    } else {
      return {
        status: false,
        error: "The email does not exist.",
      };
    }
  }

  // Validate a token
  async validate(token) {
    try {
      const result = await knex
        .select()
        .table("password_tokens")
        .where({ token: token });

      // Checks if the token exists and has been used
      if (result.length > 0 && !result[0].used) {
        return {
          status: true,
          token: result[0],
        };
      } else {
        return {
          status: false,
          error: "Invalid token.",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: false,
        error: "Token does not exist.",
      };
    }
  }

  async setUsed(token) {
    await knex
      .update({ used: 1 })
      .table("password_tokens")
      .where({ token: token });
  }
}

module.exports = new PasswordToken();
