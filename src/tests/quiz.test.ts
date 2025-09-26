import request from "supertest";
import { app } from "..";

describe("Create Quiz Route", () => {
    it("should create a new quiz", async () => {
        const res = await (request)(app).post("/api/v1/quiz/create-quiz").send({
            title: "Node.js quiz"
        })

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true)
    })

    it("should get all the quizes", async () => {
        const res = await (request)(app).get("/api/v1/quiz/get-all-quiz")

        expect(res.statusCode).toBe(200)
        expect(res.body.success).toBe(true)
    })
})



