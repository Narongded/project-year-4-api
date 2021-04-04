import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import uid from 'uid';
import path, { resolve } from 'path';
import generator from 'generate-password'
import { adminAuth, permit } from '../service/passportAdmin.js';
import { upload } from '../service/handlefile.js'
import con from '../manage/connectdb.js'
const router = express.Router();
const app = express();
//-------------------------------------Setting----------------------------------
router.put('/shared/:uid', (req, res, next) => {
    const sql = `UPDATE lecturesharetoggle set status = ${req.body.status} where alluser_uid = "${req.params.uid}" `;
    con.query(sql, (err, result) => {
        console.log(err)
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})

router.put('/update-chapter/:chapterid', (req, res, next) => {
    const sql = `UPDATE chapter SET name = ? WHERE cid = ${req.params.chapterid}`;
    const values = [
        [
            `${req.body.chaptername}`,
        ]
    ];
    con.query(sql, [values], (err, result) => {
        if (err || result.length === 0) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})

router.delete('/delete-chapter/:chapterid', (req, res, next) => {
    const sql = `DELETE FROM chapter WHERE cid=${req.params.chapterid}`;

    con.query(sql, (err, result) => {

        if (err || result.length === 0) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})

router.get('/getfile-pdf/:chapterid', (req, res, next) => {

    const sql = `SELECT * FROM pdf WHERE chapter_cid = ${req.params.chapterid} `;

    con.query(sql, (err, result, field) => {

        if (err) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ data: result, status: 'Success' })
    });
})


//---------------------------user manager-----------------------------------

export default router