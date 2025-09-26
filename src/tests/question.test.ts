import { client } from "../utils/prismaClient";
import request from 'supertest'
import { app } from "..";


beforeEach(async () => {
  await client.option.deleteMany();
  await client.question.deleteMany();
  await client.quiz.deleteMany();
});


afterAll(async () => {
  await client.$disconnect();
});

describe("Question routes", () => {
    let quizId: string;

    beforeEach(async () => {
        // Create a quiz to attach questions to
        const quiz = await client.quiz.create({
        data: { title: "Sample Quiz" },
        });
        quizId = quiz.id;
    });

    it("add question to quiz",async () => {
        const res = await (request)(app).post("/api/v1/questions/add-question-to-quiz").send({
            question: "What is Node.js?",
            options: ["Runtime", "Framework", "Library"],
            quizId,
            rightAnswer: "Runtime"
        })

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.question.text).toBe("What is Node.js?");
    })

    it("get all the questions related to quiz", async () => {
        const res = await (request)(app).get(`/api/v1/questions/get-all-question-to-quiz?qId=${quizId}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe("Question and options fetched successfully")
    })

    it("submit and get score in return", async () => {
        const question = await client.question.create({
            data: {
                text: "Capital of France?",
                quizId,
                options: {
                create: [
                    { text: "Paris", isCorrect: true },
                    { text: "London", isCorrect: false },
                ],
                },
            },
            include: { options: true },
            });

            const correctOption = question.options.find((o) => o.isCorrect)!;

            const res = await (request)(app)
            .post("/api/v1/questions/submit-answer")
            .send({
                quizId,
                answers: [
                { questionId: question.id, optionId: correctOption.id },
                ],
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.score).toBe(1);
            expect(res.body.total).toBe(1);
        });
    })