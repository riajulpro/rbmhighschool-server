"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/verify-otp", auth_controller_1.verifyOtp);
router.post("/change-password", auth_controller_1.changePassword);
router.put("/update/:id", auth_controller_1.updateUser);
exports.default = router;
