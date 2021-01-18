import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import con from '../manage/connectdb.js'
dotenv.config();
const router = express.Router();

router.post('/', async (req, res, next) => {
    console.log(req.body)
    const sql = "INSERT INTO alluser (firstname, lastname,studentnumber,email,password,role) VALUES ?";
    const values = [
        [
            `${req.body.first_name}`,
            `${req.body.last_name}`,
            `${req.body.studentnumber}`,
            `${req.body.email}`,
            `${bcrypt.hashSync(req.body.password, 10)}`,
            `${req.body.role}`,
        ]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) return res.status(400).json({ mes: 'Email หรือ รหัสนักศึกษามีอยู๋ในระบบแล้ว' });
        return res.status(200).json({mes : 'Success'})
    });
})
export default router