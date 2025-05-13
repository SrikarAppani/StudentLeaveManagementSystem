const express = require("express");
const authenticateToken = require("../middleware/authMiddleware.js");
const { login, signup, updateToken, pendingLeaves, requestsHistory, studentPastRequests, handleApproval } = require("../controllers/facultyController");

const router = express.Router();

router.post("/login", login);
router.post("/sign-up", signup);
router.post("/update-token", authenticateToken, updateToken);
router.get("/pending", authenticateToken, pendingLeaves);
router.get("/history", authenticateToken, requestsHistory);
router.get("/view-student-past-requests", authenticateToken, studentPastRequests);
router.post("/handle-approval", authenticateToken, handleApproval);

module.exports = router;