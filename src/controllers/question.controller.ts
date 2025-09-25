import { Request, Response } from "express";
import { client } from "../utils/prismaClient";

export const addQuestionToQuiz = async (req: Request, res: Response) => {
    try {
        const {question, options, quizId, rightAnswer} = req.body
        if(!question || !options || !quizId || !rightAnswer){
            res.status(400).json({
                success: false,
                message: "Missing details"
            })
            return
        }

        if (!options.includes(rightAnswer)) {
            res.status(400).json({
                success: false,
                message: "Right answer must be one of the provided options"
            });
            return
        }
        const quiz = await client.quiz.findUnique({
            where:{
                id: quizId
            }
        })
        if(!quiz){
            res.status(404).json({
                success: false,
                message: "Quiz not found"
            })
            return
        }
        const ques = await client.question.create({
            data:{
                quizId,
                text: question,
                options: {
                    create: options.map((opt: string) => ({
                        text: opt,
                        isCorrect: opt === rightAnswer
                    }))
                }
            },
            include: {options: true}
        })

        res.status(201).json({
            success: true,
            message: "Question added successfully",
            question: ques
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
        return
    }
}