
# Online Quiz App Backend 📝

A backend service built with Express, TypeScript, and Prisma to support quiz creation, question management, and quiz-taking (answer submission + scoring).

ASE Challege



## Features

- Create quizzes (unique title enforcement)
- Add questions to quizzes
- Support for single-answer and multiple-answer question types
- Retrieve all questions + options for a quiz
- Submit answers and receive score response
- Validation, error handling, and proper HTTP status codes
- Test suite (Jest + Supertest)

---

## Tech Stack

- Node.js + Express
- TypeScript
- Prisma (with PostgreSQL or other SQL)
- Jest + Supertest (for testing)
- dotenv for environment variables

---

## Getting Started

### Installation

```bash
git clone https://github.com/ankitjha209/online-quiz-app-backend.git
cd online-quiz-app-backend
npm install
```

### Environment Variables

Create a `.env` file in project root with:

```ini
DATABASE_URL="postgresql://user:password@host:port/dbname"
PORT=8080
NODE_ENV=development
```
Adjust according to your database.

### Database & Prisma Setup

Define Prisma schema in `prisma/schema.prisma`.

Generate Prisma client:

```bash
npx prisma generate
```

(Optional) Run database migrations:

```bash
npx prisma migrate dev
```

### Running in Development / Production

Development:

```bash
npm run dev
```

Build + run:

```bash
npm run build
npm run start
```

---

## API Endpoints

Base path: `/api/v1`

### Quiz Routes

| Method | Endpoint          | Body / Query         | Responses                  |
|--------|-------------------|----------------------|----------------------------|
| POST   | /quiz/create-quiz | { title: string }    | 201: success; 400, 409: errors |


Example:

```json
POST /api/v1/quiz/create-quiz
{
  "title": "Node.js Basics"
}
```

Example response:

```json
{
  "success": true,
  "message": "Quiz created successfully",
  "quiz": {
    "id": "uuid",
    "title": "Node.js Basics",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Question Routes

| Method | Endpoint                      | Body / Query                                             | Description                         |
|--------|------------------------------|----------------------------------------------------------|-------------------------------------|
| POST   | /questions/add-question-to-quiz | { question, options: string[], quizId, rightAnswer, type } | Add question with answers          |
| GET    | /questions/get-all-question-to-quiz | Query: ?qId=quizId                                       | Get all questions & options        |
| POST   | /questions/submit-answer      | { quizId, answers: [ { questionId, optionId } ] }        | Submit answers and get score       |

Notes:

- `type` must be `"SINGLE"` or `"MULTIPLE"`.
- For `SINGLE`, `rightAnswer` is string.
- For `MULTIPLE`, `rightAnswer` is array of strings.

---

## Question Types (SINGLE / MULTIPLE)

Prisma enum `TYPE`:

```prisma
enum TYPE {
  SINGLE
  MULTIPLE
}
```

- SINGLE → One correct option.
- MULTIPLE → One or more correct options.

---

## Testing
To run your tests properly, you should set the NODE_ENV environment variable to "test" in your .env file before running the tests.

Here’s the simple step:

- Open your .env file.

- Change or add the line:

```
NODE_ENV=test
```

- Then run your tests using:

```bash
npm test
```

Tests use Jest and Supertest, located in `src/tests/`.

---

## Project Structure

```
/
|— prisma/
|     |— schema.prisma
|
|— src/
|     |— controllers/
|     |     |— quiz.controller.ts
|     |     |— question.controller.ts
|     |
|     |— routes/
|     |     |— quiz.routes.ts
|     |     |— question.routes.ts
|     |— tests/
|     |     |— quiz.test.ts
|     |     |— question.test.ts
|     |— utils/
|     |     |— prismaClient.ts
|     |
|     |— index.ts
|     |— server.ts
|— .env
|— package.json
|— tsconfig.json
|— jest.config.js
```

