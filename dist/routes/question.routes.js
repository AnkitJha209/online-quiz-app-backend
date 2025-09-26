"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const question_controller_1 = require("../controllers/question.controller");
exports.questionRoutes = express_1.default.Router();
exports.questionRoutes.post('/add-question-to-quiz', question_controller_1.addQuestionToQuiz);
exports.questionRoutes.get('/get-all-question-to-quiz', question_controller_1.getAllQuestionToAQuiz);
exports.questionRoutes.post('/submit-answer', question_controller_1.submitQuizAns);
