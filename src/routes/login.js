import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
const router = express.Router();

router.post('/', (req, res, next) => {
    console.log(req.body)
})
// router.post('/', async (req, res, next) => {

//     // Can delete ------> 
//     if (process.env.MASTER_USER === req.body.username && bcrypt.compareSync(req.body.password, process.env.MASTER_PASSWORD)) {
//         const resdata = {
//             uid: '',
//             username: process.env.MASTER_USER,
//             nametitle: '',
//             firstname: 'master',
//             lastname: '',
//             position: '',
//             role: 'admin',
//             note: '',
//         }
//         const token = 'Bearer ' + jwt.sign(
//             {
//                 username: resdata.username, uid: '', role: resdata.role
//             },
//             'your_jwt_secret',
//             {
//                 expiresIn: "6h",
//             }
//         )
//         return res.status(200).json({
//             status: 'Success',
//             data: resdata,
//             token: token
//         })
//     }
//     // <------------- 
//     await modeluser.find({ username: req.body.username }, (err, doc) => {
//         if (err || doc.length === 0) res.status(400).json({ status: 'error wrong user or password' })
//         doc.map((_data, index) => {
//             if (bcrypt.compareSync(req.body.password, _data.password)) {
//                 const resdata = {
//                     uid: _data.uid,
//                     username: _data.username,
//                     nametitle: _data.nametitle,
//                     firstname: _data.firstname,
//                     lastname: _data.lastname,
//                     position: _data.position,
//                     role: _data.role,
//                     note: _data.note,
//                 }
//                 const token = 'Bearer ' + jwt.sign(
//                     {
//                         username: _data.username, uid: _data.uid, role: _data.role
//                     },
//                     'your_jwt_secret',
//                     {
//                         expiresIn: "6h",
//                     }
//                 )
//                 return res.status(200).json({
//                     status: 'Success',
//                     data: resdata,
//                     token: token
//                 })
//             }
//             else {
//                 res.status(400).json({ status: 'error wrong user or password' })
//             }
//         })
//     })
// })



export default router