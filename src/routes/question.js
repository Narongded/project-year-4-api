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
    const sql = "INSERT INTO question (name,alluser_uid,page,pdfid) VALUES ?";
    const values = [
        [
            `${req.body.question}`,
            `${req.body.uid}`,
            `${req.body.page}`,
            `${req.body.pdfid}`
        ]
    ];
    con.query(sql, [values], (err, result) => {
        console.log(err)
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})
router.get('/getquestion-pdf/:pdfid', (req, res, next) => {
    const sql = `SELECT * from question WHERE pdfid = ${req.params.pdfid}`;
    con.query(sql, (err, result) => {
        console.log(err)
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ data: result, status: 'Success' })
    });
})
export default router
