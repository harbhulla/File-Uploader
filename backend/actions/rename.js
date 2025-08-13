import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
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

router.put("/renameFolder", upload.none(), async (req, res, next) => {
  try {
    const [newStr, newPath] = transformString(req.body.path, req.body.name);
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

    const currentPath = path.join(process.cwd(), req.body.path);
    const futurePath = path.join(process.cwd(), newPath);
    fs.rename(currentPath, futurePath, (err) => {
      console.log("Renamed!");
    });
    res.json(folder);
  } catch (err) {
    next(err);
  }
});

export default router;
