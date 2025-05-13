const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
    {
        rollNumber: {type: String, required:true, unique: true},
        name: {type: String, required:true},
        password: {type: String, required:true},
        emailID: {type: String, required:true, unique: true},
        deviceTokens: {type: [String], default: []},
        year: {type:Number, required:true},
        department: {type: String, required:true},
        section: {type:String, required: true},
        isEnrolledInPlacementTraining: {type: Boolean, default: false}
    }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;