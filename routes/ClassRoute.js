import express from "express";
import {
    getClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
} from "../controllers/Classes.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/Classes', verifyUser, getClasses);
router.get('/Classes/:id', verifyUser, getClassById);
router.post('/Classes', verifyUser, createClass);
router.patch('/Classes/:id', verifyUser, updateClass);
router.delete('/Classes/:id', verifyUser, deleteClass);

export default router;