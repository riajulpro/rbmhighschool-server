"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallery = void 0;
const mongoose_1 = require("mongoose");
const gallerySchema = new mongoose_1.Schema({
    title: String,
    description: String,
    mediaUrls: [String],
    type: { type: String, enum: ["video", "photo"], required: true },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.Gallery = (0, mongoose_1.model)("Gallery", gallerySchema);
