import express, { Router } from 'express'
import { addQuestionToQuiz, getAllQuestionToAQuiz, submitQuizAns } from '../controllers/question.controller'

export const questionRoutes : Router = express.Router()

questionRoutes.post('/add-question-to-quiz', addQuestionToQuiz)
questionRoutes.get('/get-all-question-to-quiz', getAllQuestionToAQuiz)
questionRoutes.post('/submit-answer', submitQuizAns)