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


router.get('/getfile-pdf/:pdfid', (req, res, next) => {
    const sql = `SELECT * FROM pdf WHERE tpid = ${req.params.pdfid} `;
    con.query(sql, (err, result, field) => {
        res.status(200).json({ data: result, status: 'Success' })
    });
})
router.get('/getfile-lecture/:pdfid', (req, res, next) => {
    const sql = `SELECT * FROM studentpdf WHERE alluser_uid = "${req.params.uid}" `;
    con.query(sql, (err, result, field) => {
        res.status(200).json({ data: result, status: 'Success' })
    });
})
router.get('/getdata-lecture/:uid/:cid', (req, res, next) => {
    const sql = `SELECT * 
    FROM studentpdf
    INNER JOIN pdf on studentpdf.teacherpdf_tpid = pdf.tpid
    INNER JOIN chapter on chapter.cid = pdf.chapter_cid
    WHERE studentpdf.alluser_uid = "${req.params.uid}" and chapter.cid = ${req.params.cid}`;
    con.query(sql, (err, result, field) => {
        res.status(200).json({ data: result, status: 'Success' })
    });
})

router.get('/getchapter/:uid', (req, res, next) => {
    const sql = `SELECT *
    FROM studentpdf
    INNER JOIN pdf on studentpdf.teacherpdf_tpid = pdf.tpid
    INNER JOIN chapter on chapter.cid = pdf.chapter_cid
    WHERE studentpdf.alluser_uid = "${req.params.uid}"`;
    con.query(sql, (err, result, field) => {
        console.log(err)
        console.log(result)
        res.status(200).json({ data: result, status: 'Success' })
    });
})

router.post('/upload-studentpdf', (req, res, next) => {
    if (req.files === null) return res.status(400).json({ status: 'File PDF not found' })
    const sql = `SELECT * FROM studentpdf
    WHERE alluser_uid = "${req.body.userid}"
    and teacherpdf_tpid = ${req.body.teacherpdf_tpid}`
    con.query(sql, (err, result, field) => {
        console.log(err)
        if (err || result.length === 0) {
            const namefile = uid() + '.pdf';
            const filepdf = req.files.file
            const insert = "INSERT INTO studentpdf (spdfname,alluser_uid,teacherpdf_tpid) VALUES ?";
            const values = [
                [
                    `${namefile}`,
                    `${req.body.userid}`,
                    `${req.body.teacherpdf_tpid}`,
                ]
            ];
            con.query(insert, [values], (err, insertresult, field) => {

                if (insertresult.length === 0) return res.status(400).json({ status: 'failed wrong data' })
                filepdf.mv(path.join(path.resolve(), '/src/public/pdf/') + namefile);
                return res.status(200).json({ status: 'Success' })
            });
        }
        else {
            const filepdf = req.files.file
            fs.unlinkSync(path.join(path.resolve(), '/src/public/pdf/') + result[0].spdfname)
            filepdf.mv(path.join(path.resolve(), '/src/public/pdf/') + result[0].spdfname)
            return res.status(200).json({ status: 'Success' })
        }
    });
})

export default router
