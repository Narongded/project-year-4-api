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

// router.get('/agenda/getall', adminAuth(), permit(['admin', 'staff', 'council', 'guest']), async (req, res, next) => {

//   await modelagenda.find({}, (err, doc) => {
//     if (err || doc.length === 0) return res.status(400).json({ status: 'failed to load data' })
//     res.status(200).json({ doc, status: 'Success' })
//   });
// })

// router.get('/term/:agendaid', adminAuth(), permit(['admin', 'staff', 'council', 'guest']), async (req, res, next) => {

//   const agenda = await modelagenda.findOne({ uid: req.params.agendaid });

//   const data = await modelterm.aggregate([
//     {
//       $match: {
//         uid: req.params.agendaid
//       }
//     },
//     {
//       $lookup:
//       {
//         from: 'subterm',
//         localField: 'termid',
//         foreignField: 'termid',
//         as: 'subterm'
//       }
//     }
//   ]).exec(async (err, data) => {
//     const odrdata = await modelsubterm.find({ uid: req.params.agendaid }).sort('index')
//     return res.status(200).json({ topic: agenda, data: data, orderdata: odrdata, status: 'Success' })
//   })
// })

// router.get('/subterm/:subid', adminAuth(), permit(['admin', 'staff', 'council', 'guest']), async (req, res, next) => {

//   const subterm = await modelsubterm.findOne(({ subid: req.params.subid }))
//   const topic = await modelterm.aggregate([
//     {
//       $match: {
//         termid: subterm.termid
//       }
//     },
//     {
//       $lookup:
//       {
//         from: 'Agenda',
//         localField: 'uid',
//         foreignField: 'uid',
//         as: 'agenda'
//       }
//     }
//   ])



//   return res.status(200).json({ topic: topic[0].agenda[0].topic, subterm: subterm, status: 'Success' })
// })






export default router