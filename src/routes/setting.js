import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import uid from 'uid';
import path, { resolve } from 'path';
import generator from 'generate-password'
import { adminAuth, permit } from '../service/passportAdmin.js';
import { upload } from '../service/handlefile.js'
import con from '../manage/connectdb.js'
import nodemailer from 'nodemailer'
const router = express.Router();
const app = express();
//-------------------------------------Setting----------------------------------



router.get('/loadSetting/:uid', (req, res, next) => {

    const sql = `SELECT * FROM lecturesharetoggle WHERE alluser_uid = "${req.params.uid}"`
    con.query(sql, (err, result, field) => {
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        const sql = `SELECT * FROM lecturesharedlist WHERE lecturesharetoggle_sharedtoggleid = ${result[0].sharedtoggleid}`
        con.query(sql, (err, result2, field) => {
            if (err) return res.status(400).json({ status: 'failed wrong data' })
            res.status(200).json({ data: result2, statusshared: result, status: 'Success' })
        });
    });
})


router.put('/shared/:uid', (req, res, next) => {
    const sql = `UPDATE lecturesharetoggle set status = ${req.body.status} where alluser_uid = "${req.params.uid}" `;
    con.query(sql, (err, result) => {
        console.log(err)
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})
router.put('/accept-shared/:sharedlistid', (req, res, next) => {
    const sql = `UPDATE lecturesharedlist set status = 1 where sharedlistid = "${req.params.sharedlistid}" `;
    con.query(sql, (err, result) => {
        console.log(err)
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'slackdevtool002@gmail.com',
                pass: 'jackkubpom55'
            }
        });
        var mailOptions = {
            from: `${req.body.owner.split("it")[1]}@it.kmitl.ac.th`,
            to: `${req.body.email.split("it")[1]}@it.kmitl.ac.th`,
            subject: 'Accept for Access',
            text: `${req.body.owner} is accepting access to the following profile: http://localhost:3000/student-chapter/${req.body.owner}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.status(200).json({ status: 'Success' })
    });
})

router.post('/add-people/:listid', (req, res, next) => {
    const sql2 = `SELECT * FROM  lecturesharedlist WHERE alluser_uid = "${req.body.email}" and 
    lecturesharetoggle_sharedtoggleid = ${req.params.listid}`;
    con.query(sql2, (err, result) => {
        if (err) return res.status(400).json({ status: 'failed wrong data' })
        if (result.length === 0) {
            const sql = `insert into lecturesharedlist (lecturesharetoggle_sharedtoggleid,alluser_uid,status) VALUES ?`;
            const values = [
                [
                    `${req.params.listid}`,
                    `${req.body.email}`,
                    1
                ]
            ];
            con.query(sql, [values], (err, result2) => {
                if (err) return res.status(400).json({ status: 'failed wrong data' })
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'slackdevtool002@gmail.com',
                        pass: 'jackkubpom55'
                    }
                });
                var mailOptions = {
                    from: `${req.body.owner.split("it")[1]}@it.kmitl.ac.th`,
                    to: `${req.body.email.split("it")[1]}@it.kmitl.ac.th`,
                    subject: 'Invite to Access',
                    text: `${req.body.owner.split("it")[1]} is inviting to access to the following profile: http://localhost:3000/student-chapter/${req.body.owner}`
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.status(200).json({ status: 'Success' })
            });
        }
        else {
            res.status(200).json({ status: 'Success' })
        }
    })

})

router.delete('/delete-people/:sharedlistid', (req, res, next) => {
    const sql = `DELETE FROM lecturesharedlist WHERE sharedlistid=${req.params.sharedlistid}`;

    con.query(sql, (err, result) => {
        console.log(err)
        if (err || result.length === 0) return res.status(400).json({ status: 'failed wrong data' })
        res.status(200).json({ status: 'Success' })
    });
})


//---------------------------user manager-----------------------------------

export default router