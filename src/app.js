
import express from 'express';
import path from 'path';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import userRouter from './routes/user.js';
import adminRouter from './routes/admin.js';
import loginRouter from './routes/login.js';
import regisRouter from './routes/regis.js';
import checktokenRouter from './routes/checktoken.js';
import  fileUpload from 'express-fileupload'
import './manage/connectdb.js'

const app = express();

app.use(fileUpload({
  createParentPath: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(path.resolve(), '/src/public')));
app.use('/login', loginRouter);
app.use('/checktoken', checktokenRouter);
app.use('/regis', regisRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.listen(process.env.PORT || 3000, () => {
  console.log('PORT: 3000')
})

export default app
