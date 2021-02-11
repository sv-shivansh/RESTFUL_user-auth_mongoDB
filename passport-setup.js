const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User_google = require("./models/user-google");
const allUser = require("./models/allUser");
require('dotenv').config()

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  allUser.findById(id, (err, user) => done(err, user));
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      //req.user = profile.id;
      //   console.log(profile);
      try {
        let user = await User_google.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          let user1 = {
            name: profile.displayName,
            email: profile.emails[0].value,
            isOAuth: true,
          };
          data = await allUser.create(user1);
          const Newuser = new User_google({
            user_id: data.id,
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          user = await User_google.create(Newuser);
          done(null, user);
        }
      } catch (error) {
        console.error(error);
      }
      // try{
      //   const name = profile._json.name
      //   const email = profile._json.email
      //   let user = await User.findOne({email});
      //   if (user) { console.log("user exist")}
      // else {user = new User({
      //     name,
      //     email
      // });
      // await user.save();
      // const payload = {
      //        user:{
      //            id:user.id
      //        }
      //    }
      //    jwt.sign(payload,'mysecretkey',{expiresIn: 36000}, (err,token)=>{
      //        if(err) throw err;
      //        console.log({token})
      //     });
      //     return done(null, user);
      //   }}
      // catch(err){console.error(err.message+'\n'+err);
      //     res.send('server error');}
      return done(null, profile);
    }
  )
);
