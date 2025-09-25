import { Request, Response } from "express";
import { client } from "../utils/prismaClient";



export const createQuiz = async (req: Request, res: Response) => {
    try {
        const {title} = req.body
        if(!title){
            res.status(400).json({
                success: false,
                message: "Title is missing"
            })
            return
        }
        const alreadyExist = await client.quiz.findFirst({
            where:{
                title
            }
        })
        if(alreadyExist){
            res.status(409).json({
                success: false,
                message: "Title already exist"
            })
            return
        }
        const newQuiz = await client.quiz.create({
            data:{
                title
            }
        })
        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            quiz: newQuiz
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getAllQuizes = async (req: Request, res: Response) => {
    try{
        const allQuizes = await client.quiz.findMany()
        res.status(200).json({
            success: false,
            message: "All quizes fetched successfully",
            quizes: allQuizes
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}