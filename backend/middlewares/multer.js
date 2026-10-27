import multer from "multer";
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // ✅ Allows up to 50MB files
    }
})

export default upload;