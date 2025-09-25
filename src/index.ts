import express, { Application, Request, Response, urlencoded } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from './generated/prisma';

dotenv.config()

const app : Application = express();
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

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`)
})