"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["PRINCIPAL"] = "principal";
    UserRole["TEACHER"] = "teacher";
    UserRole["STUDENT"] = "student";
})(UserRole || (exports.UserRole = UserRole = {}));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.STUDENT,
        required: true,
    },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
