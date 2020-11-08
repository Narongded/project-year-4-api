import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import uid from 'uid';
import path, { resolve } from 'path';
import generator from 'generate-password'
import { adminAuth, permit } from '../service/passportAdmin.js';
import { upload } from '../service/handlefile.js'
import { rejects } from 'assert';

const router = express.Router();
const app = express();

router.get('/', adminAuth(), (req, res, next) => {


    return res.status(200).json({ status: 'Success' })
})

export default router