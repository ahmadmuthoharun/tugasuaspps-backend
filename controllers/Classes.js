import Class from "../models/ClassModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getClasses = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin","user"){
            response = await Class.findAll({
                attributes:['uuid','classname','description','visibility'],
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Class.findAll({
                attributes:['uuid','classname','description','visibility'],
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

export const getClassById = async(req, res) =>{
    try {
        const myClass = await Class.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!myClass) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Class.findOne({
                attributes:['uuid','classname','description','visibility'],
                where:{
                    id: myClass.id
                },
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Class.findOne({
                attributes:['uuid','classname','description','visibility'],
                where:{
                    [Op.and]:[{id: myClass.id}, {userId: req.userId}]
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

export const createClass = async(req, res) =>{
    const {classname, description, visibility} = req.body;
    try {
        await Class.create({
            classname: classname,
            description: description,
            visibility: visibility,
            userId: req.userId
        });
        res.status(201).json({msg: "Class Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateClass = async(req, res) =>{
    try {
        const myClass = await Class.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!myClass) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {classname, description, visibility} = req.body;
        if(req.role === "admin"){
            await Class.update({classname, description, visibility},{
                where:{
                    id: myClass.id
                }
            });
        }else{
            if(req.userId !== myClass.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Class.update({classname, description, visibility},{
                where:{
                    [Op.and]:[{id: myClass.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Class updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteClass = async(req, res) =>{
    try {
        const myClass = await Class.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!myClass) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {classname, description, visibility} = req.body;
        if(req.role === "admin"){
            await Class.destroy({
                where:{
                    id: myClass.id
                }
            });
        }else{
            if(req.userId !== myClass.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Class.destroy({
                where:{
                    [Op.and]:[{id: myClass.id}, {userId: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Class deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}