const Faculty = require("../models/Faculty.js");
const Student = require("../models/Student.js");
const DeptHOD = require("../models/DeptHOD.js");
const FullDayLeaveRequests = require("../models/FullDayLeaveRequest");
const HalfDayLeaveRequests = require("../models/HalfDayLeaveRequest");
const sendPushNotification = require("../notifications/pushNotification.js");
const sendEmailNotification = require("../notifications/emailNotification.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pendingLeaves = async (req, res) => {
  try {
    const facultyID = req.query.facultyID;

    const halfDayPending = await HalfDayLeaveRequests.find({
      $or: [{ facultyID: facultyID }, { placementFacultyID: facultyID }],
      status: { $in: ["Pending", "Partially Approved"] },
    });

    const fullDayPending = await FullDayLeaveRequests.find({
      $or: [{ facultyID: facultyID }, { placementFacultyID: facultyID }],
      status: { $in: ["Pending", "Partially Approved"] },
    });

    const pendingLeaves = [
      ...(halfDayPending || []),
      ...(fullDayPending || []),
    ];
    pendingLeaves.sort((a, b) => {
      const aVal = a.get("date") || a.get("fromDate");
      const bVal = b.get("date") || b.get("fromDate");
      return bVal - aVal;
    });

    const pendingLeavesWithNames = [];

    for (let request of pendingLeaves) {
      const student = await Student.findOne({
        rollNumber: request.studentRollNumber,
      });
      const plainRequest = request.toObject();
      plainRequest.name = student?.name;
      plainRequest.leaveType = request.numberOfDays
        ? request.numberOfDays === 1
          ? "Full-Day"
          : "Multiple days"
        : "Half-Day";
      pendingLeavesWithNames.push(plainRequest);
    }

    res.status(200).json(pendingLeavesWithNames);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending requests", error });
  }
};

const requestsHistory = async (req, res) => {
  try {
    const facultyID = req.query.facultyID;
    const halfDayHistory = await HalfDayLeaveRequests.find({
      $or: [{ facultyID: facultyID }, { placementFacultyID: facultyID }],
      status: { $in: ["Approved", "Rejected"] },
    });
    const fullDayHistory = await FullDayLeaveRequests.find({
      $or: [{ facultyID: facultyID }, { placementFacultyID: facultyID }],
      status: { $in: ["Approved", "Rejected"] },
    });

    const requestsHistory = [
      ...(halfDayHistory || []),
      ...(fullDayHistory || []),
    ];
    requestsHistory.sort((a, b) => {
      const aVal = a.get("date") || a.get("fromDate");
      const bVal = b.get("date") || b.get("fromDate");
      return bVal - aVal;
    });

    const requestsHistoryWithNames = [];

    for (let request of requestsHistory) {
      const student = await Student.findOne({
        rollNumber: request.studentRollNumber,
      });
      const plainRequest = request.toObject();
      plainRequest.name = student?.name;
      plainRequest.leaveType = request.numberOfDays
        ? request.numberOfDays === 1
          ? "Full-Day"
          : "Multiple days"
        : "Half-Day";
      requestsHistoryWithNames.push(plainRequest);
    }
    res.status(200).json(requestsHistoryWithNames);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requests history ", error });
  }
};

const studentPastRequests = async (req, res) => {
  const rollNumber = req.query.rollNumber;
  try {
    const halfDayRequests = await HalfDayLeaveRequests.find({
      studentRollNumber: rollNumber,
    });
    const fullDayRequests = await FullDayLeaveRequests.find({
      studentRollNumber: rollNumber,
    });

    const pastRequests = [
      ...(halfDayRequests || []),
      ...(fullDayRequests || []),
    ];
    pastRequests.sort((a, b) => {
      const aVal = a.get("date") || a.get("fromDate");
      const bVal = b.get("date") || b.get("fromDate");
      return bVal - aVal;
    });

    res.status(200).json(pastRequests);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching student's past requests", err });
  }
};

const handleApproval = async (req, res) => {
  const requestId = req.query.requestId;
  const requestType = req.body.requestType;
  const action = req.body.action;
  const facultyID = req.body.facultyID;

  const faculty = await Faculty.findOne(
    { facultyID: facultyID },
    { department: 1, _id: 0 }
  );
  const approver = faculty.department;

  const LeaveRequests =
    requestType === "Full-Day" ? FullDayLeaveRequests : HalfDayLeaveRequests;

  const request = await LeaveRequests.findById(requestId);
  const plainRequest = request.toObject();

  if (approver === "Placement") {
    plainRequest.placementApprovalStatus =
      action === "approve" ? "Approved" : "Rejected";
  } else {
    plainRequest.facultyApprovalStatus =
      action === "approve" ? "Approved" : "Rejected";
  }

  if (plainRequest.placementFacultyID) {
    if (
      plainRequest.placementApprovalStatus === "Rejected" ||
      plainRequest.facultyApprovalStatus === "Rejected"
    ) {
      plainRequest.status = "Rejected";
    } else if (
      plainRequest.placementApprovalStatus === "Approved" &&
      plainRequest.facultyApprovalStatus === "Approved"
    ) {
      plainRequest.status = "Approved";
    } else {
      plainRequest.status = "Partially Approved";
    }
  } else {
    plainRequest.status = plainRequest.facultyApprovalStatus;
  }

  await LeaveRequests.findByIdAndUpdate(requestId, plainRequest, { new: true, runValidators: true });

  if (plainRequest.status === "Approved" || plainRequest.status === "Rejected") {
    sendNotification(plainRequest);
  }

  res.status(200).send({ currentStatus: plainRequest.status });
};

const updateToken = async (req, res) => {
  const { facultyID, deviceToken } = req.body;

  try {
    const updateResult = await Faculty.updateOne(
      { facultyID },
      { $addToSet: { deviceTokens: deviceToken } }
    );

    if (updateResult.matchedCount > 0) {
      res.status(200).json({ message: "Device token added successfully" });
    } else {
      res
        .status(404)
        .json({ message: `No faculty found with ID: ${facultyID}` });
    }
  } catch (error) {
    console.error("Error updating device token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signup = async (req, res) => {
  const facultyID = req.body.facultyID;
  const name = req.body.name;
  const emailID = req.body.emailID;
  const password = req.body.password;
  const department = req.body.department;

  if (!facultyID || !name || !emailID || !password || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingFaculty = await Faculty.findOne({ facultyID });
    if (existingFaculty) {
      return res.status(400).json({ message: "Faculty already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFaculty = new Faculty({
      facultyID,
      name,
      emailID,
      password: hashedPassword,
      department,
    });

    await newFaculty.save();
    
    const token = jwt.sign({ facultyID: facultyID }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
  
    res.json({ token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const facultyID = req.body.facultyID;
  const password = req.body.password;
  if (!facultyID || !password) {
    return res
      .status(400)
      .json({ message: "Both teacher ID and password are required" });
  }

  try {
    const teacher = await Faculty.findOne({ facultyID });
    if (!teacher) {
      return res.status(401).json({ message: "Invalid teacher ID" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ facultyID: facultyID }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
  
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const sendNotification = async (request) => {
  const studentRollNumber = request.studentRollNumber;
  const student = await Student.findOne(
    { rollNumber: studentRollNumber },
    { name: 1, emailID: 1, deviceTokens: 1, _id: 0 }
  );

  const tokens = student.deviceTokens || [];
  let anySent = false;

  for (let token of tokens) {
    const result = await sendPushNotification(
      token,
      `Leave Request ${request.status}`,
      "Click to view",
      "http://localhost:5713/student-login"
    );

    if (result.success) {
      anySent = true;
    } else if (result.reason === "invalid-token") {
      await deleteToken(studentRollNumber, token);
    }
  }

  if (!anySent && student.emailID) {
    await sendEmailNotification(
      student.emailID,
      `Leave Request ${request.status}`,
      `
        <p>Dear ${student.name},</p>
        <p>Your leave request is ${request.status}.</p>
        <p>Please check and respond.</p>
        </br>
        <a href="http://localhost:5713/student-login"
            style="
                display: inline-block;
                padding: 10px 20px;
                margin-top: 10px;
                font-size: 16px;
                color: white;
                background-color:rgb(0, 255, 102);
                text-decoration: none;
                border-radius: 5px;">
            View Leave Request
        </a>
      `
    );
  }
};

const deleteToken = async (rollNumber, tokenToDelete) => {
  try {
    const result = await Student.updateOne(
      { rollNumber: rollNumber },
      { $pull: { deviceTokens: tokenToDelete } }
    );

    if (result.modifiedCount > 0) {
      console.log(`Successfully removed token for student ${rollNumber}`);
    } else {
      console.log(`No token removed for student ${rollNumber} — token may not exist`);
    }
  } catch (error) {
    console.error(`Error removing token for student ${rollNumber}:`, error);
  }
};

module.exports = {
  login,
  signup,
  updateToken,
  pendingLeaves,
  requestsHistory,
  studentPastRequests,
  handleApproval,
};
