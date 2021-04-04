import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import con from '../manage/connectdb.js'
import { loginLdap } from '../service/ldap.js'
import Cryptr from 'cryptr'
const router = express.Router();

router.post('/', (req, res, next) => {
    loginLdap(req.body.email, req.body.password).then((result) => {
        const cryptr = new Cryptr('secretepassword');
        const encrypepassword = cryptr.encrypt(req.body.password);
        const email = result.userPrincipalName.split("@")[0]
        let ldaprole = ''
        result.description === "IT Student" ? ldaprole = "student" : ldaprole = "teacher"
        const resdata = {
            firstname: result.givenName,
            lastname: result.sn,
            email: email,
            role: ldaprole,
            uid: result.uSNCreated,
        }
        const token = 'Bearer ' + jwt.sign(
            { email: req.body.email, password: encrypepassword },
            'itkmitl',
            { expiresIn: "6h" })
        const sql = `SELECT * FROM lecturesharetoggle WHERE alluser_uid =  "${req.body.email}" `;
        con.query(sql, (err, result, field) => {
            if (result.length === 0) {
                const sql2 = `INSERT INTO lecturesharetoggle(alluser_uid) VALUES ("${req.body.email}")`;
                con.query(sql2, (err, result) => {
                    if (err) return res.status(400).json({ status: 'failed wrong data' })
                    return res.status(200).json({
                        status: 'Success',
                        data: resdata,
                        token: token
                    })
                });
            }
            else {
                return res.status(200).json({
                    status: 'Success',
                    data: resdata,
                    token: token
                })
            }
        });

    }).catch((err) => res.status(400).json({ status: 'error wrong user or password' }))
})


export default router