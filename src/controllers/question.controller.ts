import { Request, Response } from "express";
import { client } from "../utils/prismaClient";

export const addQuestionToQuiz = async (req: Request, res: Response) => {
    try {
        const { question, options, quizId, rightAnswer, type } = req.body;

        if (!question || !options || !quizId || !rightAnswer || !type) {
            res.status(400).json({
                success: false,
                message: "Missing details",
            });
            return
        }

        if (!Array.isArray(options) || options.length < 2) {
            res.status(400).json({
                success: false,
                message: "At least two options are required",
            });
            return 
        }

        // Handle type-specific validation
        if (type === "SINGLE") {
        if (Array.isArray(rightAnswer)) {
            res.status(400).json({
                success: false,
                message: "Right answer must be a string for SINGLE choice questions",
            });
            return
        }

        if (!options.includes(rightAnswer)) {
            res.status(400).json({
                success: false,
                message: "Right answer must be one of the provided options",
            });
            return
        }
        } else if (type === "MULTIPLE") {
        if (!Array.isArray(rightAnswer) || rightAnswer.length === 0) {
            res.status(400).json({
                success: false,
                message: "Right answer must be an array of strings for MULTIPLE choice questions",
            });
            return 
        }

        const invalidAnswers = rightAnswer.filter((ans: string) => !options.includes(ans));
        if (invalidAnswers.length > 0) {
            res.status(400).json({
                success: false,
                message: `Invalid right answers: ${invalidAnswers.join(", ")}`,
            });
            return
        }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid question type",
            });
            return
        }

        // Validate quiz existence
        const quiz = await client.quiz.findUnique({
        where: { id: quizId },
        });

        if (!quiz) {
            res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
            return
        }

        // Create question and options
        const ques = await client.question.create({
        data: {
            quizId,
            text: question,
            type,
            options: {
            create: options.map((opt: string) => ({
                text: opt,
                isCorrect:
                type === "SINGLE"
                    ? opt === rightAnswer
                    : (rightAnswer as string[]).includes(opt),
            })),
            },
        },
        include: { options: true },
        });

        return res.status(201).json({
        success: true,
        message: "Question added successfully",
        question: ques,
        });
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
            return
        }

        let score = 0;

        for (const ans of answers) {
            const question = questions.find(q => q.id === ans.questionId);
            if (!question) continue;

            if (question.type === "SINGLE") {
                // ✅ one answer only
                const correctOption = question.options.find(opt => opt.isCorrect);
                if (correctOption && correctOption.id === ans.optionId) {
                score++;
                }
            } else if (question.type === "MULTIPLE") {
                // ✅ multiple answers allowed
                const correctOptions = question.options.filter(opt => opt.isCorrect).map(o => o.id);
                const submittedOptions = ans.optionIds || [];

                // compare sets
                const isCorrect =
                correctOptions.length === submittedOptions.length &&
                correctOptions.every(id => submittedOptions.includes(id));

                if (isCorrect) score++;
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