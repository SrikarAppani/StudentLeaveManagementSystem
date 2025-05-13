const Student = require("../models/Student.js");
const Faculty = require("../models/Faculty.js");
const ClassTeacher = require("../models/ClassTeacher.js");
const DeptHOD = require("../models/DeptHOD.js");
const HalfDayLeaveRequests = require("../models/HalfDayLeaveRequest.js");
const FullDayLeaveRequests = require("../models/FullDayLeaveRequest.js");
const sendPushNotification = require("../notifications/pushNotification.js");
const sendEmailNotification = require("../notifications/emailNotification.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pendingLeaves = async (req, res) => {
  try {
    const rollNumber = req.query.rollNumber;

    const halfDayPending = await HalfDayLeaveRequests.find({
      studentRollNumber: rollNumber,
      status: { $in: ["Pending", "Partially Approved"] },
    });

    const fullDayPending = await FullDayLeaveRequests.find({
      studentRollNumber: rollNumber,
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

    res.status(200).json(pendingLeaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending requests", error });
  }
};

const requestsHistory = async (req, res) => {
  try {
    const rollNumber = req.query.rollNumber;
    const halfDayHistory = await HalfDayLeaveRequests.find({
      studentRollNumber: rollNumber,
      status: { $in: ["Approved", "Rejected"] },
    });
    const fullDayHistory = await FullDayLeaveRequests.find({
      studentRollNumber: rollNumber,
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

    res.status(200).json(requestsHistory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requests history ", error });
  }
};

const updateToken = async (req, res) => {
  const { rollNumber, deviceToken } = req.body;

  try {
    const updateResult = await Student.updateOne(
      { rollNumber },
      { $addToSet: { deviceTokens: deviceToken } }
    );

    if (updateResult.matchedCount > 0) {
      res.status(200).json({ message: "Device token added successfully" });
    } else {
      res.status(404).json({ message: `No student found with roll number: ${rollNumber}` });
    }
  } catch (error) {
    console.error("Error updating device token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const rollNumber = req.body.rollNumber;
  const password = req.body.password;
  const student = await Student.findOne({ rollNumber: rollNumber });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  try {
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ rollNumber: rollNumber }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signup = async (req, res) => {
  const rollNumber = req.body.rollNumber;
  const name = req.body.name;
  const password = req.body.password;
  const year = req.body.year;
  const department = req.body.department;
  const section = req.body.section;
  const emailID = req.body.emailID;
  const isEnrolledInPlacementTraining = req.body.isEnrolledInPlacementTraining;

  const student = await Student.findOne({ rollNumber: rollNumber });
  if (student) {
    res.status(400).json({
      message: `Student with roll number ${rollNumber} already exists`,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newStudent = new Student({
      rollNumber: rollNumber,
      password: hashedPassword,
      emailID: emailID,
      name: name,
      year: year,
      department: department,
      section: section,
      isEnrolledInPlacementTraining: isEnrolledInPlacementTraining,
    });

    await newStudent.save();

    const token = jwt.sign({ rollNumber: rollNumber }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const applyhalfdayleave = async (req, res) => {
  const { rollNumber, _ } = req.body;
  try {
    const student = await Student.findOne({ rollNumber: rollNumber });

    if (!student) {
      res.status(404).json({ error: "Student not found." });
    }

    const classTeacher = await ClassTeacher.findOne({
      year: student.year,
      department: student.department,
      section: student.section,
    });

    if (!classTeacher) {
      res.status(404).json({ error: "Teacher not found." });
    }

    const teacherID = classTeacher.classTeacherID;

    const teacher = await Faculty.findOne({ facultyID: teacherID });
    const tokens = teacher.deviceTokens;

    if (!student.isEnrolledInPlacementTraining) {
      const newHalfDayRequest = new HalfDayLeaveRequests({
        date: new Date(req.body.date),
        reason: req.body.reason,
        explanation: req.body.explanation,
        studentRollNumber: student.rollNumber,
        facultyID: teacherID,
      });

      await newHalfDayRequest.save();
    }

    if (student.isEnrolledInPlacementTraining) {
      const placementHOD = await DeptHOD.findOne({department: "Placement"}, {facultyID:1, _id:0});
      console.log(placementHOD);
      const placementFacultyID = placementHOD.facultyID;

      const newHalfDayRequest = new HalfDayLeaveRequests({
        date: new Date(req.body.date),
        reason: req.body.reason,
        explanation: req.body.explanation,
        studentRollNumber: student.rollNumber,
        facultyID: teacherID,
        placementFacultyID: placementFacultyID,
      });

      await newHalfDayRequest.save();

      const placementFaculty = await Faculty.findOne(
        { facultyID: placementFacultyID },
        { deviceTokens: 1, _id: 0 }
      );

      const placementFacultyTokens = placementFaculty.deviceTokens;

      sendNotification(
        placementFacultyTokens,
        student.name,
        placementFaculty.emailID
      );
    }

    sendNotification(tokens, student.name, teacher.emailID);

    res.status(200).json({ message: "Notification attempt completed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

const applyfulldayleave = async (req, res) => {
  const { rollNumber, _ } = req.body;
  try {
    const student = await Student.findOne({ rollNumber: rollNumber });
    if (!student) {
      res.status(404).json({ error: "Student not found." });
    }

    const hod = await DeptHOD.findOne({
      department: student.department,
    });

    const hodID = hod.facultyID;

    const faculty = await Faculty.findOne({ facultyID: hodID });
    const tokens = faculty.deviceTokens;

    if (!student.isEnrolledInPlacementTraining) {
      const newFullDayRequest = new FullDayLeaveRequests({
        numberOfDays: req.body.numberOfDays,
        fromDate: new Date(req.body.fromDate),
        toDate: new Date(req.body.toDate),
        reason: req.body.reason,
        explanation: req.body.explanation,
        studentRollNumber: student.rollNumber,
        facultyID: hodID,
      });

      await newFullDayRequest.save();
    }

    if (student.isEnrolledInPlacementTraining) {
      const placementFacultyID = (
        await DeptHOD.findOne({
          department: "Placemnet",
        })
      ).hodID;

      const newFullDayRequest = new FullDayLeaveRequests({
        numberOfDays: req.body.numberOfDays,
        fromDate: new Date(req.body.fromDate),
        toDate: new Date(req.body.toDate),
        reason: req.body.reason,
        explanation: req.body.explanation,
        studentRollNumber: student.rollNumber,
        facultyID: hodID,
        placementFacultyID: placementFacultyID,
      });

      await newFullDayRequest.save();

      const placementFaculty = await Faculty.findOne(
        { facultyID: placementFacultyID },
        { deviceTokens: 1, _id: 0 }
      );

      const placementFacultyTokens = placementFaculty.deviceTokens;

      sendNotification(
        placementFacultyTokens,
        student.name,
        placementFaculty.emailID
      );
    }

    sendNotification(tokens, student.name, faculty.emailID);

    res.status(200).json({ message: "Notification attempt completed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

const sendNotification = async (tokens, studentName, emailID) => {
  let sent = false;

  for (let token of tokens) {
    sent = await sendPushNotification(
      token,
      `Leave request from ${studentName}`,
      "Click to view",
      "http://localhost:5713/faculty-login"
    );
  }

  if (!sent && emailID) {
    await sendEmailNotification(
      emailID,
      `Leave Request from ${studentName}`,
      `
      <p>${studentName} has applied for a leave.</p>
      <p>Please check and respond.</p>
      <a href="http://localhost:5713/faculty-login"
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

const getGatePassURL = async (req, res) => {
  res.status(200).json({message:"http://localhost:5000/assets/GatePass.png"});
}

module.exports = {
  updateToken,
  login,
  signup,
  applyhalfdayleave,
  applyfulldayleave,
  pendingLeaves,
  requestsHistory,
  getGatePassURL
};
