import express from 'express';
import {check, validationResult} from "express-validator";
import bcrypt from 'bcryptjs';
import prisma from '../server.js'; 


const router = express.Router();

const signupValidation = [
  check("input.email").trim().escape().isEmail().normalizeEmail().withMessage("Invalid email"),
  check("input.password").trim().escape().notEmpty().isLength({ min: 6 }).withMessage("Password too short"),
  check("input.confirmPass").trim().escape().custom((value, { req }) => {
    if (value !== req.body.input.password) {
      throw new Error("Passwords do not match!");
    }
    return true;
  }),
   (req, res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});
    next();
  }
];


router.post("/signup", signupValidation, hashPassword, async (req, res, next) => {
  console.log("✅ Clean body:", req.body);
  console.log("🔐 Hashed password:", res.locals.hashed);
 try {
    const user = await prisma.user.create({
      data: {email: req.body.input.email, password: res.locals.hashed}
    });
     req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: "Logged in!", user });
    });
  } catch (err) {
    if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Email already in use' });
  }
    console.error('❌ Prisma create error:', err);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

export async function hashPassword(req, res, next) {
  try {
    const hashed = await bcrypt.hash(req.body.input.confirmPass, 10);
    res.locals.hashed = hashed;
    next();
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


export default router;