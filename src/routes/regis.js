import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import con from '../manage/connectdb.js'
dotenv.config();
const router = express.Router();

router.post('/', async (req, res, next) => {
    console.log(req.body)
    const sql = "INSERT INTO alluser (firstname, lastname,email,password,role) VALUES ?";
    const values = [
        [
            `${req.body.first_name}`,
            `${req.body.last_name}`,
            `${req.body.email}`,
            `${bcrypt.hashSync(req.body.password, 10)}`,
            `${req.body.role}`,
        ]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
})
export default router