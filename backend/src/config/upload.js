const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        //Asta e pentru nume unic, ne folosim de momentul cand e generat fisierul in nume
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

//Asta e verificarea pentru tipurile de fisier
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Doar doc, docx si pdf sunt permise!'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } //Aici am pus limita ca sa nu incarce careva un fisier de 1 terabyte :)
});

module.exports = upload;