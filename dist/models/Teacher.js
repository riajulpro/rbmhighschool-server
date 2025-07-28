"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = void 0;
const mongoose_1 = require("mongoose");
const teacherSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    department: String,
    designation: String,
    phone: String,
    photo: String,
    qualification: String,
}, { timestamps: true });
exports.Teacher = (0, mongoose_1.model)("Teacher", teacherSchema);
