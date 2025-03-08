const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema(
    {
        facultyID: {type: String, required:true, unique: true},
        name: {type: String, required:true},
        password: {type: String, required:true},
        deviceToken: {type: String, required:false, unique: true},
        department: {type: String, required:true}
    }
);

const Faculty = mongoose.model("Faculty", FacultySchema);

module.exports = Faculty;