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
exports.getAllQuizes = exports.createQuiz = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        if (!title) {
            res.status(400).json({
                success: false,
                message: "Title is missing"
            });
            return;
        }
        const alreadyExist = yield prismaClient_1.client.quiz.findFirst({
            where: {
                title
            }
        });
        if (alreadyExist) {
            res.status(409).json({
                success: false,
                message: "Title already exist"
            });
            return;
        }
        const newQuiz = yield prismaClient_1.client.quiz.create({
            data: {
                title
            }
        });
        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            quiz: newQuiz
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
exports.createQuiz = createQuiz;
const getAllQuizes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allQuizes = yield prismaClient_1.client.quiz.findMany();
        res.status(200).json({
            success: false,
            message: "All quizes fetched successfully",
            quizes: allQuizes
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
exports.getAllQuizes = getAllQuizes;
