const { request, response } = require("express");
const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", (request, response) => {
  response.status(200).send({ message: "Hello to my server!" });
});
//users controllers
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/users/:id", userController.deleteUser)
router.put("/users",userController.updateOne)

module.exports = router;
