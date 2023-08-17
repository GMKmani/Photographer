const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const UserRegistration = require("./model");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const bodyparser = require("body-parser");
const { constants } = require("fs/promises");
const { log } = require("console");
app.use(bodyparser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
mongoose
  .connect(
    `mongodb://Mani:Mani143@ac-pflvloi-shard-00-00.gpdkybd.mongodb.net:27017,ac-pflvloi-shard-00-01.gpdkybd.mongodb.net:27017,ac-pflvloi-shard-00-02.gpdkybd.mongodb.net:27017/mydb?ssl=true&replicaSet=atlas-6llt7d-shard-0&authSource=admin&retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: "/uploads/",

  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
// const maxSize = 10 * 1024 * 1024;
const upload = multer({ storage });

const verifyToken = async (req, res, next) => {
  const token = req.cookies.Token;
  jwt.verify(token, "jeth445", (err, decoded) => {
    if (err) {
      res.send({ message: "Unauthorized Access" });
    } else if (decoded) {
      req._id = decoded.userDB._id;
      console.log(req._id);
      next();
    }
  });
};
// // app.use(body - parser());
// const db = mysql.createConnection({
//   user: "root",
//   host: "localhost",
//   password: "",
//   database: "photography",
// });
// db.connect(function (err) {
//   if (err) throw err;
//   console.log("connected");
// });

// app.post("/sign", (req, res) => {
//   console.log("hrllo");
//   const { username, password } = req.body;
//   db.query(
//     "SELECT * from users where username=? AND password=?",
//     [username, password],
//     function (err, result) {
//       if (err) {
//         console.log(err);
//         res.send({ err: err });
//       } else {
//         console.log(result);
//         res.status.json({ data: result });
//       }
//     }
//   );
// });

app.post("/register", upload.single("image"), async (req, res) => {
  const path1 = req.file.path;
  var image = fs.readFileSync(path.join(__dirname + path1));

  var image1 = image.replace(/\\/g, "/");
  console.log(image1);
  // Define a JSONobject for the image attributes for saving to database

  // var finalImg = {
  //   contentType: req.file.mimetype,

  //   images: Buffer.from(encode_image, "base64"),
  // };

  const { username, password, repassword, email, phone } = req.body;
  const userDB = await UserRegistration.findOne({ username });

  if (userDB) {
    res.send("Username already exists");
  } else {
    const Registration = new UserRegistration({
      image,
      username,
      password,
      repassword,
      email,
      phone,
    })
      .save()
      .then((result) => {
        if (result) {
          console.log(result);
          res.send({ data: result });
        } else console.log(err);
      });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDB = await UserRegistration.findOne(
    { username },
    { _id: 1, username: 1 }
  );

  if (userDB) {
    let Token = jwt.sign({ userDB }, "jeth445", {
      expiresIn: "2h",
    });
    res.cookie("Token", Token);
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});

app.get("/allprofiles", verifyToken, async (req, res) => {
  await UserRegistration.find()
    .then((retrievedata) => {
      res.send({ retrievedata: retrievedata, data: req._id });
    })
    .catch((err) => console.log(err));
});

app.delete("/del", async (req, res) => {
  await UserRegistration.deleteMany({})
    .then(() => console.log("hello"))
    .catch((err) => console.log(err));
});

app.get("/edit", verifyToken, async (req, res) => {
  await UserRegistration.findOne({ username: req.username })
    .then((retrievedata) => {
      console.log(req.cookies.token);
      res.send({ retrievedata: retrievedata });
    })
    .catch((err) => console.log(err));
});

app.put("/up/:username", (req, res) => {
  console.log(req.params.username);
  console.log(req.body);
  UserRegistration.updateOne(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
      },
    },
    { new: true }
  )
    .then((result) => {
      res.status(200).json({ updated: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/logout", async (req, res) => {
  res.clearCookie("Token");
  res.json("hello");
});

app.listen(3001, () => {
  console.log("server running");
});
