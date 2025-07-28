"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionInfo = void 0;
const mongoose_1 = require("mongoose");
const institutionInfoSchema = new mongoose_1.Schema({
    name: String,
    establishedYear: Number,
    location: String,
    contactEmail: String,
    phone: String,
    about: String,
}, { timestamps: true });
exports.InstitutionInfo = (0, mongoose_1.model)("InstitutionInfo", institutionInfoSchema);
