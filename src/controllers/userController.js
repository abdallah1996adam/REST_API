require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { request, response } = require("express");
const Users = require("../models/users");
const MAXAGE = Math.floor(Date.now() / 1000) + 60 * 60;

exports.register = async (request, response) => {
  const { first_name, last_name, email, password } = request.body;
  try {
    const result = await Users.getUserEmail(email);
    //chech if user doesn't exist in database
    if (result[0].length !== 0) {
      response.status(400).json({ message: "user alreday exist" });
    } else {
      const saltRounds = 10;
      //creating the hashed password 
      const hash = await bcrypt.hash(password, saltRounds);
      if (!hash) {
        response.status(409).json({ message: "server error" });
      } else {
        const newUser = {
          first_name,
          last_name,
          email,
          password: hash,
        };
        //adding new user in database
        await Users.addOne(newUser);
        response.status(201).json({ message: `it's good ` });
      }
    }
  } catch (error) {
    console.error(error.message);
    response.status(409).json({ message: error.message });
  }
};

exports.login = async (request, response) => {
  const { email, password } = request.body;
  try {
    const result = await Users.getUserEmail(email);
    //chehcking if user already registred 
    if (result[0].length === 0) {
      response.status(404).json({ message: "user doesn't exist" });
    } else {
      const userPassword = await result[0][0].password;
      if (!userPassword) {
        response.status(402).json({ message: "bad request" });
      } else {
        //checking if the password is correct 
        const hash = await bcrypt.compare(password, userPassword);
        if (!hash) {
          response.status(402).json({ message: "password is not correct" });
        } else {
          const user = {
            id: result[0].id,
            exp: MAXAGE,
          };
          //generating jsonwebtoken with the secret and user data
          const token = await jwt.sign(user, process.env.SECRET);
          if (!token) {
            response.status(500).json({ message: "token problem" });
          } else {
            response
              .status(200)
              .json({ message: "you are welcome", token: token });
          }
        }
      }
    }
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ message: "server error" });
  }
};

exports.deleteUser = async (request, response) => {
  const id = request.params.id;
  try {
    const getOne = await Users.getOne(id);
    if (getOne[0].length === 0) {
      response.status(402).json({ message: "user doesn't exist" });
    } else {
      const userDelete = await Users.deleteOne(id);
      response.status(200).json({ message: "user is deleted" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "serevr error" });
  }
};

exports.updateOne = async (request, response) => {
  const { first_name, last_name, email, password, id } = request.body;

  try {
    const checkUser = await Users.getOne(id);
    if (checkUser[0].length === 0) {
      response.status(402).json({ message: "user doesn't exist" });
    } else {
      const saltRound = 10;
      const hash = await bcrypt.hash(password, saltRound);
      const user = await Users.updateOne(
        first_name,
        last_name,
        email,
        hash,
        id
      );
      console.log(user);
      response
        .status(200)
        .json({ message: "user modified successfully", data: user });
    }
  } catch (error) {
    response.status(500).json({ message: "server error" });
  }
};
