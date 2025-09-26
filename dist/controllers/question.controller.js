"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitQuizAns = exports.getAllQuestionToAQuiz = exports.addQuestionToQuiz = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const addQuestionToQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, options, quizId, rightAnswer } = req.body;
        if (!question || !options || !quizId || !rightAnswer) {
            res.status(400).json({
                success: false,
                message: "Missing details"
            });
            return;
        }
        if (!options.includes(rightAnswer)) {
            res.status(400).json({
                success: false,
                message: "Right answer must be one of the provided options"
            });
            return;
        }
        const quiz = yield prismaClient_1.client.quiz.findUnique({
            where: {
                id: quizId
            }
        });
        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
            return;
        }
        const ques = yield prismaClient_1.client.question.create({
            data: {
                quizId,
                text: question,
                options: {
                    create: options.map((opt) => ({
                        text: opt,
                        isCorrect: opt === rightAnswer
                    }))
                }
            },
            include: { options: true }
        });
        res.status(201).json({
            success: true,
            message: "Question added successfully",
            question: ques
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        return;
    }
});
exports.addQuestionToQuiz = addQuestionToQuiz;
const getAllQuestionToAQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { qId } = req.query;
        if (!qId) {
            res.status(400).json({
                success: false,
                message: "Missing quiz id"
            });
            return;
        }
        const quizId = String(qId);
        const questions = yield prismaClient_1.client.question.findMany({
            where: {
                quizId
            },
            include: { options: true }
        });
        if (!questions) {
            res.status(404).json({
                success: false,
                message: "No quiz or questions found"
            });
            return;
        }
        const filteredQuestion = questions.map((ques) => ({
            question: ques.text,
            options: ques.options.map((opt) => (({
                id: opt.id,
                option: opt.text,
                questionId: opt.questionId
            })))
        }));
        res.status(200).json({
            success: true,
            message: "Question and options fetched successfully",
            filteredQuestion
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.getAllQuestionToAQuiz = getAllQuestionToAQuiz;
const submitQuizAns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId, answers } = req.body;
        if (!quizId || !answers || !Array.isArray(answers)) {
            res.status(400).json({
                success: false,
                message: "Invalid request"
            });
            return;
        }
        const questions = yield prismaClient_1.client.question.findMany({
            where: {
                quizId
            },
            include: { options: true }
        });
        if (!questions) {
            res.status(404).json({
                success: false,
                message: "No questions found"
            });
        }
        let score = 0;
        for (const ans of answers) {
            const question = questions.find((q) => q.id == ans.questionId);
            if (!question)
                continue;
            const correctOption = question.options.find((opt) => opt.isCorrect);
            if (correctOption && correctOption.id == ans.optionId) {
                score++;
            }
        }
        res.status(200).json({
            success: true,
            message: "Score fetched successfully",
            score,
            total: answers.length
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.submitQuizAns = submitQuizAns;
