import mongoose from 'mongoose'
import dotenv from 'dotenv'
import mysql from 'mysql';

dotenv.config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
con.connect(function (err) {
    if (err) throw err;
    console.log('Connected Success!');
});

export default con