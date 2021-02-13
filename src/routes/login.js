import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import con from '../manage/connectdb.js'
import { loginLdap } from '../service/ldap.js'
import Cryptr from 'cryptr'
const router = express.Router();

router.post('/', async (req, res, next) => {
    loginLdap(req.body.email, req.body.password).then((result) => {
        const cryptr = new Cryptr('secretepassword');
        const encrypepassword = cryptr.encrypt(req.body.password);
        let ldaprole = ''
        result.description === "IT Student" ? ldaprole = "student" : ldaprole = "teacher"
        const resdata = {
            firstname: result.givenName,
            lastname: result.sn,
            email: result.userPrincipalName,
            role: ldaprole,
            uid : result.uSNCreated,
        }
        const token = 'Bearer ' + jwt.sign(
            { email: req.body.email, password: encrypepassword },
            'itkmitl',
            { expiresIn: "6h" })
        return res.status(200).json({
            status: 'Success',
            data: resdata,
            token: token
        })
    }).catch((err) => res.status(400).json({ status: 'error wrong user or password' }))
})


export default router