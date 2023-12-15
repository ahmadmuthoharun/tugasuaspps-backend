import express from "express";
import {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
} from "../controllers/Questions.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/Questions', verifyUser, getQuestions);
router.get('/Questions/:id', verifyUser, getQuestionById);
router.post('/Questions', verifyUser, createQuestion);
router.patch('/Questions/:id', verifyUser, updateQuestion);
router.delete('/Questions/:id', verifyUser, deleteQuestion);

export default router;