import express, { Router } from 'express'
import { createQuiz, getAllQuizes } from '../controllers/quiz.controller'

export const quizRoutes:Router = express.Router()

quizRoutes.post('/create-quiz', createQuiz)
quizRoutes.get('/get-all-quiz', getAllQuizes)