const mongoose = require("mongoose");

const FullDayLeaveRequestsSchema = new mongoose.Schema(
    {
        numberOfDays: {type: Number, required:true},
        fromDate: {type: Date, required: true},
        toDate: {type: Date, required: true},
        reason: {type: String, required: true},
        explanation: {type: String, required: true},
        studentRollNumber: {type: String, required: true},
        facultyID: {type: String, required: true},
        placementFacultyID : {type: String, required: false},

        facultyApprovalStatus: {type:String, enum:['Pending', 'Approved', 'Rejected'], default:"Pending"},
        placementApprovalStatus: {type:String, enum:['Pending', 'Approved', 'Rejected'], default:"Pending"},

        status: {type: String, enum:['Pending', 'Partially Approved', 'Approved', 'Rejected', 'Expired'], default:"Pending"}
    }
);

const FullDayLeaveRequests = mongoose.model("FullDayLeaveRequests", FullDayLeaveRequestsSchema);

module.exports = FullDayLeaveRequests;