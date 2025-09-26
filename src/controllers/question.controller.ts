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

export const getAllQuestionToAQuiz = async (req: Request, res: Response)=>{
    try {
        const {qId} = req.query
        if(!qId){
            res.status(400).json({
                success: false,
                message: "Missing quiz id"
            })
            return
        }
        const quizId = String(qId)
        const questions = await client.question.findMany({
            where: {
                quizId
            },
            include: {options: true}
        })
        if(!questions){
            res.status(404).json({
                success: false,
                message: "No quiz or questions found"
            })
            return
        }

        const filteredQuestion = questions.map((ques : any)=> ({
            question: ques.text,
            options: ques.options.map((opt: any)=> ( ({
                id: opt.id,
                option: opt.text,
                questionId: opt.questionId
            })))
        }))

        res.status(200).json({
            success: true,
            message: "Question and options fetched successfully",
            filteredQuestion
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export const submitQuizAns = async (req: Request, res: Response) => {
    try {
        const {quizId, answers} = req.body
        if(!quizId || !answers || !Array.isArray(answers)){
            res.status(400).json({
                success: false,
                message: "Invalid request"
            })
            return
        }
        const questions = await client.question.findMany({
            where:{
                quizId
            },
            include: {options: true}
        })

        if(!questions){
            res.status(404).json({
                success: false,
                message: "No questions found"
            })
        }

        let score = 0;

        for(const ans of answers){
            const question = questions.find((q:any) => q.id == ans.questionId);
            if(!question) continue;

            const correctOption = question.options.find((opt: any) => opt.isCorrect)
            if(correctOption && correctOption.id == ans.optionId){
                score++;
            }
        }

        res.status(200).json({
            success: true,
            message: "Score fetched successfully",
            score,
            total: answers.length
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}