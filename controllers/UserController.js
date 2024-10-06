const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = "0b89b93324ba40fdbf9f12b8d443a458";

class UserController {
  // Route to find all users
  async index(req, res) {
    const users = await User.findAll();
    res.json(users);
  }

  // Route to create a new user
  async create(req, res) {
    const { email, name, password } = req.body;

    // Validate data and send error
    if (!email || !name || !password) {
      res.status(400);
      res.json({ error: "Invalid data." });
      return;
    }

    // Check if the email is already registered
    const emailExists = await User.findEmail(email);
    if (emailExists) {
      res.status(406);
      res.json({ error: "The e-mail is already registered." });
      return;
    }

    // Create new user in database
    await User.new(email, password, name);

    res.status(201);
    res.send("Ok!");
  }

  // Route to find a user
  async findUser(req, res) {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      res.status(200);
      res.json(user);
    } else {
      res.status(404);
      res.json({ error: "User not found." });
    }
  }

  // Route to edit user
  async edit(req, res) {
    const { id, name, role, email } = req.body;
    const result = await User.update(id, email, name, role);
    if (result) {
      if (result.status) {
        res.status(200);
        res.send("Ok!");
      } else {
        res.status(406);
        res.json({ error: result.error });
      }
    } else {
      res.status(406);
      res.json({ error: "An error occurred on the server." });
    }
  }

  // Route to remove user
  async remove(req, res) {
    const id = req.params.id;
    const result = await User.delete(id);

    if (result.status) {
      res.status(200);
      res.send("Ok!");
    } else {
      res.status(406);
      res.json({ error: result.error });
    }
  }

  async recoverPassword(req, res) {
    const { email } = req.body;
    const result = await PasswordToken.create(email);
    if (result.status) {
      res.status(200);
      res.json({ token: result.token });
    } else {
      res.status(406);
      res.json({ error: result.error });
    }
  }

  async changePassword(req, res) {
    const { token, password } = req.body;

    const isTokenValid = await PasswordToken.validate(token);

    if (isTokenValid.status) {
      await User.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );
      res.status(200);
      res.send("Ok!");
    } else {
      res.status(406);
      res.json({ error: isTokenValid.error });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (user) {
      const result = await bcrypt.compare(password, user.password);

      if (result) {
        const token = jwt.sign({ email: user.email, role: user.role }, secret);
        res.status(200);
        res.json({ token });
      } else {
        res.status(406);
        res.json({
          error:
            "The login information is incorrect. Please check your e-mail address and password and try again.",
        });
      }
    } else {
      res.status(406);
      res.json({
        error:
          "The login information is incorrect. Please check your e-mail address and password and try again.",
      });
    }
  }

  async validate(req, res) {
    res.send("Ok!");
  }
}

module.exports = new UserController();
