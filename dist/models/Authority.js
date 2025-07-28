"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authority = void 0;
const mongoose_1 = require("mongoose");
const authoritySchema = new mongoose_1.Schema({
    name: String,
    role: String,
    photo: String,
    message: String,
}, { timestamps: true });
exports.Authority = (0, mongoose_1.model)("Authority", authoritySchema);
