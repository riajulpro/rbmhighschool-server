"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notice = void 0;
const mongoose_1 = require("mongoose");
const noticeSchema = new mongoose_1.Schema({
    title: String,
    content: String,
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    forRoles: [String], // ['student', 'teacher']
}, { timestamps: true });
exports.Notice = (0, mongoose_1.model)("Notice", noticeSchema);
