const mongoose = require("mongoose");

const HODSchema = new mongoose.Schema(
    {
        department: {type: String, required:true, unique:true},
        hodID: {type:String, required: true, unique:true}
    }
);

const DeptHOD = mongoose.model("DeptHOD", HODSchema);

module.exports = DeptHOD;