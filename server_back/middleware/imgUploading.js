import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const postImges = multer({ storage: storage }).fields([
  { name: "media", maxCount: 4 },
]);

const uploadingImg = multer({ storage: storage }).fields([
  { name: "avatar", maxCount: 1 },
  { name: "backimg", maxCount: 1 },
]);

export default uploadingImg;
