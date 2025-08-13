import express from "express";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import prisma from "../server.js";
const router = express.Router();

const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: tempStorage });

router.post("/upload", upload.single("file"), async (req, res) => {
  const userFolder = `uploads/${req.body.name}`;
  try {
    fs.mkdirSync(userFolder, { recursive: true });
    const oldPath = req.file.path;
    const newPath = path.join(userFolder, req.file.originalname);
    fs.renameSync(oldPath, newPath);

    const createFolder = await prisma.folder.create({
      data: {
        name: req.body.name,
        user: {
          connect: { email: req.user.email },
        },
        files: {
          create: [
            {
              name: req.file.originalname,
              path: newPath,
              size: req.file.size.toString(),
              userEmail: req.user.email,
            },
          ],
        },
      },
      include: {
        files: true,
      },
    });
    const currentFolders = await prisma.folder.findMany({
      where: {
        userEmail: req.user.email,
      },
      include: {
        files: true,
      },
    });
    res.json(currentFolders);
  } catch (err) {
    console.error("❌ Error handling file:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/upload", async (req, res) => {
  const currentFolders = await prisma.folder.findMany({
    where: {
      userEmail: req.user.email,
    },
    include: {
      files: true,
    },
  });
  res.json(currentFolders);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
router.use(express.static(path.join(__dirname, "fileuploader")));

router.get("/download", (req, res) => {
  const imagePath = path.join(__dirname, "..", req.query.path);
  res.download(imagePath, "downloadedImage.png", (err) => {
    if (err) {
      console.error("Error downloading image:", err);
      res.status(500).send("Error downloading image");
    }
  });
});

export default router;
