// server/index.js

// require installed node packages
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { MongoDBNamespace } = require("mongodb");


// create new express app
const app = express();

//enable express to parse URL-encoded body i.e. info from HTML form
app.use(
  express.urlencoded({
    //alternative to body parser //allows to use req.body.item
    extended: true,
  })
);

app.use(express.json()); //allows to use req.body.item from fetch()

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

let mongodbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/keeperDB?retryWrites=true&w=majority`;
mongoose.connect(mongodbURI);

const userSchema = new mongoose.Schema({
  username: String,
  notes: [
    {
      title: String,
      content: String,
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      username: req.user.username,
    });
  } else {
    res.json({
      authenticated: false,
    });
  }
});

app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.json({
          authenticated: false,
          error: err.message,
        });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.json({
            authenticated: true,
            username: req.user.username,
          });
        });
      }
    }
  );
});

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.json({
                authenticated: false,
                error: info.message,
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({
                authenticated: true,
                username: req.user.username,
                notes: req.user.notes,
            });
        });
    }
    )(req, res, next);
});



app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.json({
      authenticated: false,
    });
  });
});

app.get("/notes", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      notes: req.user.notes,
    });
  } else {
    res.json({
      notes: [],
    });
  }
});

app.post("/submitNote", (req, res) => {
  console.log(req.body);
  if (req.isAuthenticated()) {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        user.notes.push({
          title: req.body.note.title,
          content: req.body.note.content,
        });
        user.save();
        res.json({
          message: "Note submitted",
          id: user.notes[user.notes.length - 1]._id,
        });
      }
    });
  } else {
    res.json({
      message: "You are not logged in",
    });
  }
});

app.post("/deleteNote", (req, res) => {
  console.log(req.body);
  if (req.isAuthenticated()) {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        user.notes.id(req.body.id).remove();
        user.save();
        res.json({
          message: "Note deleted",
        });
      }
    });
  } else {
    res.json({
      message: "You are not logged in",
    });
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
