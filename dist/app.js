"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const root_route_1 = __importDefault(require("./routes/root.route"));
const notFound_1 = require("./middlewares/notFound");
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.connectDB)();
// Routes
app.use("/", root_route_1.default);
app.use("/api/auth", require("./routes/auth.route").default);
// 404 & Error Handlers
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
