import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadingImg = multer({ storage: storage }).fields([
  { name: "avatar", maxCount: 1 },
  { name: "backimg", maxCount: 1 },
]);

export default uploadingImg;
