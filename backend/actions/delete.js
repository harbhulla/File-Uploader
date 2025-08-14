import express from "express";
import fs from "fs";
import path from "path";
import prisma from "../server.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

function transformString(str, newName) {
  const path = str;
  const firstIndex = path.indexOf("/");
  const secondIndex = path.indexOf("/", firstIndex + 1);
  const newPath = path.slice(firstIndex + 1, secondIndex);
  const newStr = str.replace(newPath, newName);

  return [newStr, newPath];
}

router.post("/deleteFolder", upload.none(), async (req, res) => {
  const [newStr, newPath] = transformString(req.body.path, req.body.name);

  const deleted = await prisma.folder.delete({
    where: {
      userEmail_name: {
        userEmail: req.user.email,
        name: newPath,
      },
    },
    include: { files: true },
  });

  fs.rm(req.body.path, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error("Error deleting folder:", err);
    } else {
      console.log("Folder deleted successfully!");
    }
  });
  res.json(deleted);
});

export default router;
