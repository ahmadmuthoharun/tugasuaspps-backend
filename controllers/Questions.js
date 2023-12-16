import Question from "../models/QuestionModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getQuestions = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin" || req.role === "user"){
            response = await Question.findAll({
                attributes:['uuid','question_text', 'topic', 'difficulty', 'answer_text_1', 'answer_text_2', 'answer_text_3', 'answer_text_4', 'answer_text_5'],
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Question.findAll({
                attributes:['uuid','question_text', 'topic', 'difficulty', 'answer_text_1', 'answer_text_2', 'answer_text_3', 'answer_text_4', 'answer_text_5'],
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getQuestionById = async(req, res) =>{
    try {
        const question = await Question.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!question) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Question.findOne({
                attributes:['uuid','question_text', 'topic', 'difficulty', 'answer_text_1', 'answer_text_2', 'answer_text_3', 'answer_text_4', 'answer_text_5'],
                where:{
                    id: question.id
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Question.findOne({
                attributes:['uuid','question_text', 'topic', 'difficulty', 'answer_text_1', 'answer_text_2', 'answer_text_3', 'answer_text_4', 'answer_text_5'],
                where:{
                    [Op.and]:[{id: question.id}, {userId: req.userId}]
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createQuestion = async(req, res) =>{
    const {question_text, topic, difficulty, answer_text_1, answer_text_2, answer_text_3, answer_text_4, answer_text_5} = req.body;
    try {
        await Question.create({
            question_text: question_text,
            topic: topic,
            difficulty: difficulty,
            answer_text_1: answer_text_1,
            answer_text_2: answer_text_2,
            answer_text_3: answer_text_3,
            answer_text_4: answer_text_4,
            answer_text_5: answer_text_5,
            userId: req.userId
        });
        res.status(201).json({msg: "Question Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateQuestion = async(req, res) =>{
    try {
        const question = await Question.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!question) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {question_text, topic, difficulty, answer_text_1, answer_text_2, answer_text_3, answer_text_4, answer_text_5} = req.body;
        if(req.role === "admin"){
            await Question.update({question_text, topic, difficulty, answer_text_1, answer_text_2, answer_text_3, answer_text_4, answer_text_5},{
                where:{
                    id: question.id
                }
            });
        }else{
            if(req.userId !== question.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Question.update({question_text, topic, difficulty, answer_text_1, answer_text_2, answer_text_3, answer_text_4, answer_text_5},{
                where:{
                    [Op.and]:[{id: question.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Question updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteQuestion = async(req, res) =>{
    try {
        const question = await Question.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!question) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {question_text, topic, difficulty, answer_text_1, answer_text_2, answer_text_3, answer_text_4, answer_text_5} = req.body;
        if(req.role === "admin"){
            await Question.destroy({
                where:{
                    id: question.id
                }
            });
        }else{
            if(req.userId !== question.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Question.destroy({
                where:{
                    [Op.and]:[{id: question.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Question deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}