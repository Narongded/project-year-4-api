import multer from 'multer'
import path from 'path';

const storage = multer.diskStorage({

    destination: (request, file, callback) => {
        console.log(path.resolve())
        callback(null, path.join(path.resolve() + '/src/public/pdf'));
    },
    filename: (request, file, callback) => {
        
        const _date = new Date();
        const time = _date.getDay() + ' ' + _date.getMonth() + ' ' + _date.getFullYear()

        callback(null, time + ' ' + file.originalname)
    }
});

export const upload = multer({ storage: storage })