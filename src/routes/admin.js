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
//-------------------------------------login----------------------------------
router.post('/create-chapter', (req, res, next) => {
    const sql = "INSERT INTO chapter (subjectid,name,semester,year,uid,teacher) VALUES ?";
    const values = [
        [
            `${req.body.subjectid}`,
            `${req.body.chaptername}`,
            `${req.body.semester}`,
            `${req.body.year}`,
            `${req.body.uid}`,
            `${req.body.teacher}`
        ]
    ];
    con.query(sql, [values], (err, result) => {

        if (err || result.length === 0) return res.status(400).json({ status: 'failed wrong data', err })
        res.status(200).json({ status: 'Success' })
    });
})

router.put('/update-chapter/:chapterid', (req, res, next) => {
    const sql = `UPDATE chapter SET subjectid=?,name=?,semester=?,year=? WHERE cid = ?`;
    const values = [
        `${req.body.subjectid}`,
        `${req.body.chaptername}`,
        `${req.body.semester}`,
        `${req.body.year}`,
        `${req.params.chapterid}`
    ];
    con.query(sql, values, (err, result) => {
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

router.get('/getall-chapter/:uid', (req, res, next) => {
    const sql = `SELECT * FROM chapter WHERE uid = ${req.params.uid} `;

    con.query(sql, (err, result, field) => {

        res.status(200).json({ data: result, status: 'Success' })
    });
})

router.post('/upload-pdf', (req, res, next) => {
    if (req.files === null) return res.status(400).json({ status: 'File PDF not found' })
    const namefile = uid() + '.pdf';
    const filepdf = req.files.file
    filepdf.mv(path.join(path.resolve(), '/src/public/pdf/') + namefile);
    const sql = "INSERT INTO pdf (tpid,pdfname,chapter_cid,tpdfpath,alluser_uid) VALUES ?";
    const values = [
        [`${uid()}`,
        `${req.body.pdfname}`,
        `${req.body.chapterid}`,
        `${namefile}`,
        `${req.body.alluser_uid}`
        ]
    ];
    con.query(sql, [values], (err, result) => {
        if (err || result.length === 0) return res.status(400).json({ status: 'failed wrong data' })
        return res.status(200).json({ status: 'Success' })
    });
})

router.post('/update-pdf/:pdfid', (req, res, next) => {
    if (req.files !== null) {
        const namefile = uid() + '.pdf';
        const filepdf = req.files.file
        filepdf.mv(path.join(path.resolve(), '/src/public/pdf/') + namefile);
        const sql = "UPDATE pdf SET pdfname=?,tpdfpath=? WHERE tpid = ?";
        const values = [
            `${req.body.pdfname}`,
            `${namefile}`,
            `${req.params.pdfid}`
        ];
        con.query(sql, values, (err, result) => {
            if (err || result.length === 0) return res.status(400).json({ status: 'failed wrong data', err })
            return res.status(200).json({ status: 'Success' })
        });
    } else {
        const sql = "UPDATE pdf SET pdfname=? WHERE tpid = ?";
        const values = [
            `${req.body.pdfname}`,
            `${req.params.pdfid}`
        ];
        con.query(sql, values, (err, result) => {
            if (err || result.length === 0) return res.status(400).json({ status: 'failed wrong data', err })
            return res.status(200).json({ status: 'Success' })
        });
    }
})


router.get('/getfile-pdf/:chapterid', (req, res, next) => {

    const sql = `SELECT * FROM pdf WHERE chapter_cid = ${req.params.chapterid} `;

    con.query(sql, (err, result, field) => {

        if (err) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ data: result, status: 'Success' })
    });
})






router.delete('/delete-pdf/:pdfid', (req, res, next) => {
    const sql = `DELETE FROM pdf WHERE tpid= "${req.params.pdfid}"`;

    con.query(sql, (err, result) => {

        if (err || result.length === 0) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})

router.get('/getdata-studentlecture/:pdfid', (req, res, next) => {
    const sql = `SELECT studentpdf.alluser_uid, 
    studentpdf.point,
    studentpdf.teacherpdf_tpid, pdf.pdfname , studentpdf.spdfname,studentpdf.sid
    FROM studentpdf
    INNER JOIN pdf on studentpdf.teacherpdf_tpid = pdf.tpid
    INNER JOIN chapter on chapter.cid = pdf.chapter_cid
    WHERE pdf.tpid = "${req.params.pdfid}"`;
    con.query(sql, (err, result, field) => {
        res.status(200).json({ data: result, status: 'Success' })
    });
})

//---------------------------user manager-----------------------------------

export default router