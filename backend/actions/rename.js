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
  const currentFolderName = path.slice(0, secondIndex);
  const newPath = path.slice(firstIndex + 1, secondIndex);
  const newStr = str.replace(newPath, newName);

  return [newStr, newPath, currentFolderName, "/uploads/" + newName];
}

router.put("/renameFolder", upload.none(), async (req, res) => {
  try {
    const [newStr, newPath, currentFolderName, futureFolderName] =
      transformString(req.body.path, req.body.name);
    const folder = await prisma.folder.update({
      where: {
        userEmail_name: {
          userEmail: req.user.email,
          name: newPath,
        },
      },
      data: {
        name: req.body.name,
        files: {
          update: [
            {
              where: { path: req.body.path },
              data: {
                path: newStr,
              },
            },
          ],
        },
      },
      include: { files: true },
    });
    const currentPath = path.join(process.cwd(), currentFolderName);
    const futurePath = path.join(process.cwd(), futureFolderName);
    fs.rename(currentPath, futurePath, (err) => {
      if (err) next(err);
      console.log("Renamed!");
    });

    res.json(folder);
  } catch (err) {
    console.error("❌ Error renaming file:", err);
    res.status(500).json({ error: "Rename failed" });
  }
});

export default router;
