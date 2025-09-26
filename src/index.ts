import express, { Application, Request, Response, urlencoded } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { quizRoutes } from './routes/quiz.routes';
import { questionRoutes } from './routes/question.routes';

dotenv.config()

export const app : Application = express();
const port = process.env.PORT || 4000;


app.use(express.json())
app.use(urlencoded())
app.use(cors())

app.get('/health-check', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "All OK"
    })
})

app.use('/api/v1/quiz', quizRoutes)
app.use('/api/v1/questions', questionRoutes)

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
  });
}