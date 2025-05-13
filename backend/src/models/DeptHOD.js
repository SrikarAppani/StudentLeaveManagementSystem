const mongoose = require("mongoose");

const HODSchema = new mongoose.Schema(
    {
        department: {type: String, required:true, unique:true},
        facultyID: {type:String, required: true, unique:true}
    }
);

const DeptHOD = mongoose.model("Dept-HOD", HODSchema);

module.exports = DeptHOD;