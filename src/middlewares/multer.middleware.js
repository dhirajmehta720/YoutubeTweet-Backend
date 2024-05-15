import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // cb -> callback
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // yha file name daalte or date ko tbhi add kra taaki duplicate pictures overwrite na ho jaye
  },
});

export const upload = multer({
  storage,
});
