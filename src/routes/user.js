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
    const sql = `SELECT * FROM pdf WHERE tpid = "${req.params.pdfid}" `;
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
    const sql = `SELECT * , GROUP_CONCAT(CONCAT('\[\',file.filename,'\,\',file.type,'\]\') SEPARATOR '|') AS file, studentpdf.alluser_uid as studentid
    FROM studentpdf
    INNER JOIN pdf on studentpdf.teacherpdf_tpid = pdf.tpid
    INNER JOIN chapter on chapter.cid = pdf.chapter_cid
    LEFT JOIN file on file.pdfid = studentpdf.sid
    WHERE studentpdf.alluser_uid = "${req.params.uid}" and chapter.cid = ${req.params.cid}
    GROUP BY studentpdf.sid`;
    con.query(sql, (err, result, field) => {
        res.status(200).json({ data: result, status: 'Success' })
    });
})

router.get('/getchapter/:uid', (req, res, next) => {
    const sql = `SELECT chapter.name, chapter.cid,  chapter.teacher,studentpdf.teacherpdf_tpid
    FROM studentpdf
    INNER JOIN pdf on studentpdf.teacherpdf_tpid = pdf.tpid
    INNER JOIN chapter on chapter.cid = pdf.chapter_cid
    WHERE studentpdf.alluser_uid = "${req.params.uid}"
    GROUP BY name`;
    con.query(sql, (err, result, field) => {
        res.status(200).json({ data: result, status: 'Success' })
    });
})
router.get('/getdatafile-pdf/:pdfid', (req, res, next) => {

    const sql = `SELECT GROUP_CONCAT(CONCAT('\[\',file.filename,'\,\',file.type,'\]\') SEPARATOR '|') AS file FROM studentpdf
    LEFT JOIN file on file.pdfid = studentpdf.sid
    WHERE studentpdf.sid = "${req.params.pdfid}" `;

    con.query(sql, (err, result, field) => {
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ data: result, status: 'Success' })
    });
})

router.post('/upload-file/:pdfid', (req, res, next) => {
    const sql1 = `SELECT * FROM file
    WHERE pdfid = "${req.params.pdfid}"
    and type = "${req.body.type}"`
    con.query(sql1, (err, result, field) => {
        if (err || result.length === 0) {
            const sql = "INSERT INTO file (pdfid,filename,type) VALUES ?";
            const namefile = req.files.file.mimetype.includes("-")
                ? uid() + "." + req.files.file.mimetype.split("-")[1]
                : uid() + "." + req.files.file.mimetype.split("/")[1]
            const values = [
                [
                    `${req.params.pdfid}`,
                    `${namefile}`,
                    `${req.body.type}`
                ]
            ];
            con.query(sql, [values], (err, insertresult, field) => {
                if (insertresult.length === 0) return res.status(400).json({ status: 'failed wrong data' })
                const filepdf = req.files.file
                filepdf.mv(path.join(path.resolve(), '/src/public/file/') + namefile);
                return res.status(200).json({ status: 'Success' })
            });
        }
        else {
            const namefile2 = req.files.file.mimetype.includes("-")
                ? uid() + "." + req.files.file.mimetype.split("-")[1]
                : uid() + "." + req.files.file.mimetype.split("/")[1]
            const sql2 = `UPDATE file 
            SET filename = "${namefile2}"
            WHERE pdfid = "${req.params.pdfid}"
            and type = "${req.body.type}"`
            con.query(sql2, (err, insertresult, field) => {
                if (err) return res.status(400).json({ status: 'failed wrong data' })
                const filepdf = req.files.file
                fs.unlinkSync(path.join(path.resolve(), '/src/public/file/') + result[0].filename)
                filepdf.mv(path.join(path.resolve(), '/src/public/file/') + namefile2)
                return res.status(200).json({ status: 'Success' })
            });
        }
    });
})

router.delete('/delete-file/:pdfid', (req, res, next) => {
    const sql = `DELETE FROM file 
    WHERE pdfid = "${req.params.pdfid}" 
    and type = "${req.body.type}"`
    con.query(sql, (err, result, field) => {
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        return res.status(200).json({ status: 'Success' })
    })
})

router.post('/upload-studentpdf', (req, res, next) => {
    if (req.files === null) return res.status(400).json({ status: 'File PDF not found' })
    const sql = `SELECT * FROM studentpdf
    WHERE alluser_uid = "${req.body.userid}"
    and teacherpdf_tpid = "${req.body.teacherpdf_tpid}"`
    con.query(sql, (err, result, field) => {
        if (err || result.length === 0) {
            const namefile = uid() + '.pdf';
            const filepdf = req.files.file
            const insert = "INSERT INTO studentpdf (sid,spdfname,alluser_uid,teacherpdf_tpid) VALUES ?";
            const values = [
                [
                    `${uid()}`,
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

router.delete('/delete-pdf/:sid', (req, res, next) => {
    const sql = `DELETE from studentpdf where sid = "${req.params.sid}"`;
    con.query(sql, (err, result, field) => {
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        return res.status(200).json({ status: 'Success' })
    });

})

export default router
