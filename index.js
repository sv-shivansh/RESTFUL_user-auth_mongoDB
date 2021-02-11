const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const allUser = require("./models/allUser");
const User_google = require("./models/user-google");
const Publish = require("./models/publish");
const middleware = require("./middleware/auth");
const connectDB = require("./config/db");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport-setup");
// @initialize app
const app = express();

//@connect database
connectDB();

app.use(express.json({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cookieSession({
    name: "",
    keys: ["key1", "key2"],
  })
);
// app.use((req,res,next)=>{
//     // res.header("Access-Control-Allow-Origin",",");
//     // res.header("Access-Control-Allow-Headers","Origin","X-Requested-With","Content-Type","Accept");
// });
app.get("/api", (req, res) => {
  res.send("API running");
});
app.get("/loginFailed", (req, res) => {
  res.send("loginFailed");
});
app.post(
  "/api/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "email is required").not().isEmpty(),
    check("password", "password is required with min 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        res.json({ msg: "user already exist" });
      }
      const user1 = { name: name, email: email };
      data = await allUser.create(user1);
      user = new User({
        user_id: data.id,
        name,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: data.id,
        },
      };
      jwt.sign(payload, "mysecretkey", { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message + "\n" + err);
      res.send("server error");
    }
  }
);

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/loginFailed" }),
  async (req, res) => {
    // Successful authentication, redirect home.
    // try {
    //   let user1 =await User_google.findOne({email:req.session.passport.user.email})
    //   const payload = {
    //     user: {
    //       id: user1.user_id,
    //     },
    //   };
    //   jwt.sign(payload, "mysecretkey", { expiresIn: 36000 }, (err, token) => {
    //     if (err) throw err;
    //      return res.json({token});
    //   });
    // } catch (err) {
    //   res.send("server error");
    // }
    res.redirect(`/getToken/${req.session.passport.user.id}`);
  }
);
app.get("/getToken", async (req, res) => {
  res.send("HI");
});
app.get("/getToken/:id", async (req, res) => {
  try {
    let user1 = await User_google.findOne({ _id: req.params.id });
    const payload = {
      user: {
        id: user1.user_id,
      },
    };
    jwt.sign(payload, "mysecretkey", { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.send("Invalid Token");
  }
});
app.get("/api/user", middleware, async (req, res) => {
  try {
    const user = await allUser.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post(
  "/api/login",
  [
    check("email", "Please include valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ msg: errors.array() });
    }
    const { email, password } = req.body;
    try {
      var user = await User.findOne({ email });
      if (!user) {
        return res.json({ msg: "No user exist with this email" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.user_id,
        },
      };
      jwt.sign(payload, "mysecretkey", { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      res.send("server error");
    }
  }
);

app.post(
  "/api/publish",
  [
    middleware,
    [
      check("technology", "technology is required").not().isEmpty(),
      check("type", "type is required").not().isEmpty(),
      check("detail", "detail is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { isBlog, isTutorial, technology, type, detail } = req.body;
    const publishField = {};
    publishField.user_id = req.user.id;
    if (isBlog) publishField.isBlog = isBlog;
    if (isTutorial) publishField.isTutorial = isTutorial;
    publishField.technology = technology;
    publishField.type = type;
    publishField.detail = detail;

    try {
      await Publish.create(publishField);
      res.json(publishField);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server Error");
    }
  }
);

app.post('/api/isauthor',[middleware, [
  check("isAuthor", "True/False").not().isEmpty()
],
], async (req,res) =>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {isAuthor} = req.body
    const isAuthorField = {}
    isAuthorField.isAuthor = isAuthor
    try{
      let profile = await allUser.findOne({_id: req.user.id});
      if(profile){
      profile = await allUser.findOneAndUpdate(
      {_id: req.user.id}, 
      {$set: isAuthorField},
      {new: true}
      );
    return res.send(profile);
      }
    }
    catch(err){
      console.error(err.message);
      res.status(500).send("server Error");
    }
} )

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running at ${PORT}`);
});
