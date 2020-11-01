import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import uid from 'uid';
import path, { resolve } from 'path';
import generator from 'generate-password'
import { adminAuth, permit } from '../service/passportAdmin.js';
import { upload } from '../service/handlefile.js'


const router = express.Router();
const app = express();
//-------------------------------------login----------------------------------

// router.post('/test', (req, res, next) => {
//     const passwords = generator.generate({
//         length: 4,
//         numbers: true,
//         uppercase: false
//     });
//     new modeluser({
//         uid: uid(),
//         username: uid(),
//         password: bcrypt.hashSync(passwords, 10),
//         nametitle: 'admin',
//         firstname: 'admin',
//         lastname: 'admin',
//         position: 'admin',
//         role: 'admin',
//         note: 'admin',
//     }).save(null, (err, doc) => {

//         if (err) return res.status(400).json({ status: 'failed wrong data', err: err })
//         res.status(200).json({ Depassword: passwords, doc, status: 'Success' })
//     });
// })




//---------------------------user manager-----------------------------------

export default router