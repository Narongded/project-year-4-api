import mongoose from 'mongoose'
import dotenv from 'dotenv'
import mysql from 'mysql';

dotenv.config();
// const host = process.env.DB_HOST;
// mongoose.connect(`${host}`, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useCreateIndex', true)
// mongoose.Promise = global.Promise;
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//     console.log('Connect DB Status: Success');
// });
const con = mysql.createConnection({
host: '127.0.0.1',
user: 'root',
password: '',
database: 'test'
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected Success!');
    });
export default con