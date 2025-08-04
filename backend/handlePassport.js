import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcryptjs';
import prisma from './server.js'; 

passport.use(new LocalStrategy( {
     usernameField: 'email',
    passwordField: 'password'
},
  async (email, password, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return done(null, false, {message: "User not found"}); 
    
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) return done(null, false, { message: "Incorrect password" });
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


passport.serializeUser((user, done) => {
  return done(null, user.email); 
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return done(null, false); 
    done(null, user);
  } catch (err) {
    console.error("❌ deserializeUser failed:", err);
    done(null, false);
  }
});
