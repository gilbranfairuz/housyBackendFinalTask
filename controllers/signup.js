const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

exports.signup = async (req, res) => {
  try {
    const saltRounds = 10;
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        username
      }
    });
    if (!user) {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        const value = {
          ...req.body,
          password: hash
        };
        const newUser = await User.create(value);
        jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, (err, token) => {
          const data = {
            username,
            token
          };
          res.status(200).send({ data });
        });
      });
    } else {
      res.status(400).send({ message: "Username already registered" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error);
  }
};
