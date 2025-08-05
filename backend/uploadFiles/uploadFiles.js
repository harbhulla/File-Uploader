import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: tempStorage });

router.post("/upload", upload.single("file"), (req, res) => {
    const uploadTime = new Date();
    const formatted = uploadTime.toLocaleString("en-US", {
  year: "numeric",
  month: "short",  
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true
});
  const userFolder = `uploads/${req.body.name}`;
  
  try {
    fs.mkdirSync(userFolder, { recursive: true });

    const oldPath = req.file.path;
    const newPath = path.join(userFolder, req.file.originalname);

    fs.renameSync(oldPath, newPath);

    console.log("✅ File moved to:", newPath);
    res.json({ message: "File uploaded and folder created successfully!",
        filename:req.file.originalname,
        uploadTime:formatted,
        path:newPath,
        size:req.file.size
     });
  } catch (err) {
    console.error("❌ Error handling file:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.use(express.static(path.join(__dirname, 'fileuploader')));

app.get('/download', (req, res) => {
  const imagePath = path.join(__dirname, 'backend', req.filename); 
  res.download(imagePath, 'downloadedImage.png', (err) => {
    if (err) {
      console.error('Error downloading image:', err);
      res.status(500).send('Error downloading image');
    }
  });
});

export default router;