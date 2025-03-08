const Student = require("../models/Student.js");
const ClassTeacher = require("../models/ClassTeacher.js");
const DeptHOD = require("../models/DeptHOD.js");
const sendPushNotification = require("../notifications/pushNotification.js");
const bcrypt = require('bcryptjs');
const Binary = require("mongodb").Binary;

function encodePassword(password) {
    return Binary.createFromBase64(Buffer.from(password).toString('base64'), 0);
}

const updateToken = async (req, res) => {
    const rollNumber = req.body.rollNumber;
    const newToken = req.body.deviceToken;

    try {
        const updatedStudent = await Student.updateOne(
            {rollNumber: rollNumber},
            {$set:{deviceToken: newToken}}
        );
        if (updatedStudent.matchedCount > 0) {
            await sendPushNotification(newToken,"New Notification","Push Notifications are workinggggg!!");
            res.status(200).json({message: "Device token updated successfully"});
        } else {
            res.status(404).json({message: `No student found with roll number: ${rollNumber}`});
        }
    }
    catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

const login = async (req, res) => {
    const rollNumber = req.body.rollNumber;
    const password = req.body.password;
    const student = await Student.findOne({rollNumber: rollNumber});

    if (!student) {
        res.status(404).json({ message: 'Student not found' });
    }
    try {
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Incorrect password' });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

const signup = async (req, res) => {
    const rollNumber = req.body.rollNumber;
    const name = req.body.name;
    const password = req.body.password;
    const department = req.body.department;
    const section = req.body.section;

    const student = await Student.findOne({rollNumber: rollNumber});
    if(student) {
        res.status(400).json({message: `Student with roll number ${rollNumber} already exists`});
    }

    const encodedPassword = encodePassword(password);
    try {
    const newStudent = new Student({
        rollNumber: rollNumber,
        password: encodedPassword,
        name: name,
        department: department,
        section: section
    })

    await newStudent.save();

    res.status(201).json({message: "User registerd successfully"});

    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

module.exports = { updateToken, login, signup }