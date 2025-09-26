"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizRoutes = void 0;
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("../controllers/quiz.controller");
exports.quizRoutes = express_1.default.Router();
exports.quizRoutes.post('/create-quiz', quiz_controller_1.createQuiz);
exports.quizRoutes.get('/get-all-quiz', quiz_controller_1.getAllQuizes);
