const express = require("express");
const authenticateToken = require("../middleware/authMiddleware.js");
const { updateToken, login, signup, applyhalfdayleave, applyfulldayleave, pendingLeaves, requestsHistory, getGatePassURL } = require("../controllers/studentController.js");

const router = express.Router();

router.post("/login", login);
router.post("/sign-up", signup);
router.post("/update-token", authenticateToken, updateToken);
router.post("/half-day-leave", authenticateToken, applyhalfdayleave);
router.post("/full-day-leave", authenticateToken, applyfulldayleave);
router.get("/pending", authenticateToken, pendingLeaves);
router.get("/history", authenticateToken, requestsHistory);
router.get("/gate-pass-url", authenticateToken, getGatePassURL);

module.exports = router;