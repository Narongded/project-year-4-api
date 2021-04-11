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


router.post('/addquestion-pdf', (req, res, next) => {
    const sql = "INSERT INTO question (name,ques_alluser_uid,page,pdfid,studentpdf_sid) VALUES ?";
    const values = [
        [
            `${req.body.question}`,
            `${req.body.uid}`,
            `${req.body.page}`,
            `${req.body.pdfid}`,
            `${req.body.studentpdfpath}`
        ]
    ];
    con.query(sql, [values], (err, result) => {
        console.log(err)
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})

router.get('/getquestion-pdf/:pdfid', (req, res, next) => {
    const sql = `SELECT question.name as questionname,answer.answername,question.studentpdf_sid,
    pdf.tpid as teacherpdfid,question.qid,answer.aid,question.page,answer.ans_alluser_uid,question.ques_alluser_uid,
    studentpdf.alluser_uid as sownerpdf,pdf.alluser_uid as townerpdf, studentpdf.sid
    from question 
    LEFT JOIN answer on question.qid = answer.question_qid 
    LEFT join pdf on question.pdfid = pdf.tpid 
    LEFT join studentpdf on question.ques_alluser_uid = studentpdf.alluser_uid 
    WHERE pdfid = "${req.params.pdfid}" `;
    con.query(sql, (err, result) => {
        console.log(err)
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ data: result, status: 'Success' })
    });
})

router.put('/update-question/:qid', (req, res, next) => {
    const sql = `UPDATE question SET name = ? WHERE qid = ${req.params.qid}`;
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

router.delete('/delete-question/:qid', (req, res, next) => {
    const sql = `DELETE from question WHERE qid=${req.params.qid}`;
    con.query(sql, (err, result) => {
        console.log(err)
        if (err) res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})


export default router
