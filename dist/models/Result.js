"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const mongoose_1 = require("mongoose");
const subjectResultSchema = new mongoose_1.Schema({
    subject: String,
    marks: Number,
    comments: String,
});
const resultSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student", required: true },
    semester: {
        type: String,
        enum: ["FirstSemester", "MidTerm", "Annual"],
        required: true,
    },
    year: { type: Number, required: true },
    subjects: [subjectResultSchema],
    overallGrade: String,
}, { timestamps: true });
exports.Result = (0, mongoose_1.model)("Result", resultSchema);
