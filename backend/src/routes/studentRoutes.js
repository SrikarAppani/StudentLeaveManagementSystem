const express = require("express");
const { updateToken, login } = require("../controllers/studentController.js");

const router = express.Router();

router.post("/login", login);
router.post("/update_token", updateToken);

module.exports = router;