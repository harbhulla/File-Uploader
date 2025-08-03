import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcryptjs';

passport.use(new LocalStrategy( {
     usernameField: 'email',
    passwordField: 'password'
},
  async (email, password, done) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];

      if (!user) return done(null, false, { message: "User not found" });
    
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) return done(null, false, { message: "Incorrect password" });
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


passport.serializeUser((user, done) => {
  return done(null, user.id); 
});


passport.deserializeUser(async (id, done) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return done(null, result.rows[0]);
});
