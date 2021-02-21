import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import uid from 'uid';
import path, { resolve } from 'path';
import generator from 'generate-password'
import { adminAuth, permit } from '../service/passportAdmin.js';
import { upload } from '../service/handlefile.js'
import { rejects } from 'assert';
import fs from 'fs';
import con from '../manage/connectdb.js'
import { Console } from 'console';
const router = express.Router();
const app = express();


router.post('/addanswer-pdf', (req, res, next) => {
    const sql = "INSERT INTO answer (answername,question_qid,ans_alluser_uid) VALUES ?";
    const values = [
        [
            `${req.body.answer}`,
            `${req.body.qid}`,
            `${req.body.alluser_uid}`
        ]
    ];
    con.query(sql, [values], (err, result) => {
        console.log(err)
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})

router.put('/update-answer/:aid', (req, res, next) => {
    const sql = `UPDATE answer SET answername = ? WHERE aid = ${req.params.aid}`;
    const values = [
        [
            `${req.body.answername}`,
        ]
    ];
    con.query(sql, [values], (err, result) => {
        if (err || result.length === 0) return res.status(400).json({ status: 'failed wrong data' })
        console.log("Number of records inserted: " + result.affectedRows);
        res.status(200).json({ status: 'Success' })
    });
})

router.delete('/delete-answer/:aid', (req, res, next) => {
    const sql = `DELETE from answer WHERE aid=${req.params.aid}`;
    con.query(sql, (err, result) => {
        console.log(err)
        if (err) res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})

export default router
