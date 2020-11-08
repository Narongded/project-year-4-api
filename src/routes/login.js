import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import con from '../manage/connectdb.js'
dotenv.config();
const router = express.Router();

router.post('/', (req, res, next) => {

    const sql = `SELECT * FROM alluser WHERE email = '${req.body.email}'`;
    
    con.query(sql, (err, result, fields) => {
        if (err || result.length === 0)  return res.status(400).json({ status: 'error wrong user or password' })
        if (bcrypt.compare(result[0].password, req.body.password)) {
            const resdata = {
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                email: result[0].email,
                role: result[0].role,
                uid : result[0].id,
            }
            const token = 'Bearer ' + jwt.sign(
                {
                    email: result[0].email, id: result[0].id, role: result[0].role
                },
                'your_jwt_secret',
                {
                    expiresIn: "6h",
                }
            )
            return res.status(200).json({
                status: 'Success',
                data: resdata,
                token: token
            })
        }
        else {
            return res.status(400).json({ status: 'error wrong user or password' })
        }
    });
})


export default router