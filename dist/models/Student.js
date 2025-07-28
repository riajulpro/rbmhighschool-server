"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    class: String,
    section: String,
    rollNumber: String,
    gender: String,
    dob: Date,
    guardianName: String,
    guardianPhone: String,
    address: String,
}, { timestamps: true });
exports.Student = (0, mongoose_1.model)("Student", studentSchema);
