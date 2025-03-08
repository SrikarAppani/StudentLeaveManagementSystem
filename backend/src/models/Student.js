const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
    {
        rollNumber: {type: String, required:true, unique: true},
        name: {type: String, required:true},
        password: {type: String, required:true},
        deviceToken: {type: String, required:false, unique: true},
        department: {type: String, required:true},
        section: {type:String, required: true}
    }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;