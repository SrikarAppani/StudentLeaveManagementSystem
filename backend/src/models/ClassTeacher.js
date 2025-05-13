const mongoose = require("mongoose");

const ClassTeacherSchema = new mongoose.Schema(
    {
        year: {type: Number, required: true},
        department: {type: String, required:true},
        section: {type:String, required: true},
        classTeacherID: {type: String, required:true}
    }
);
ClassTeacherSchema.index({ department: 1, section: 1 }, { unique: true });

const ClassTeacher = mongoose.model("ClassTeacher", ClassTeacherSchema);

module.exports = ClassTeacher;