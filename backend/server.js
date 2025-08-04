import express from "express";
import dotenv from 'dotenv';
import passport from "passport";
import expressSession from 'express-session';
import pkg from '../src/generated/prisma/client.js';
const { PrismaClient } = pkg;
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import cors from 'cors';  
import signUpRoute from "./signup/signUpRoute.js";
import "./handlePassport.js";
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();
const app = express();
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SECRET_PASS,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api",signUpRoute);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: "Logged in!", user });
    });
  })(req, res, next);
});

app.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);         
        res.json({ message: "Logged out" });
  });
})


const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

export default prisma;