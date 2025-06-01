const mongoose = require("mongoose");

const HalfDayLeaveRequestsSchema = new mongoose.Schema(
    {
        date: {type: Date, required: true},
        reason: {type: String, required: true},
        explanation: {type: String, required: true},
        studentRollNumber: {type: String, required: true},
        facultyID: {type: String, required: true},
        placementFacultyID: {type: String, required: false},

        facultyApprovalStatus: {type:String, enum:['Pending', 'Approved', 'Rejected'], default:"Pending"},
        placementApprovalStatus: {type:String, enum:['Pending', 'Approved', 'Rejected'], default:"Pending"},

        status: {type: String, enum:['Pending', 'Partially Approved', 'Approved', 'Rejected', 'Expired'], default:"Pending"},
        gatePassUrl: {type: String, required: false}
    }
);

HalfDayLeaveRequestsSchema.pre("validate", function (next) {
    if (!this.placementFacultyID) {
        this.placementApprovalStatus = undefined;
    } else if (!this.placementApprovalStatus) {
        this.placementApprovalStatus = "Pending";
    }
    next();
});

const HalfDayLeaveRequests = mongoose.model("HalfDayLeaveRequests", HalfDayLeaveRequestsSchema);

module.exports = HalfDayLeaveRequests;