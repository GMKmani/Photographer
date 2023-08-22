const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
app.set("view engine", "ejs");
app.use('/',express.static('dist'));
const UserRegistration = require("./model");
const ProfilesData = require("./profiledata");
const Reserve = require("./reserve");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const bodyparser = require("body-parser");
const { constants } = require("fs/promises");
const { log } = require("console");
app.use(bodyparser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static("...../dist"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin:["http:localhost:3001",
                      "https://friendly-moxie-800ecf.netlify.app",], credentials: true }));
var id1="";
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
  destination: "../assets/images",
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
// const maxSize = 10 * 1024 * 1024;
const upload = multer({ storage });

const verifyToken = async (req, res, next) => {
  console.log(req.cookies.Token);
  const token = req.cookies.Token;
  jwt.verify(token, "jeth445", (err, decoded) => {
    if (err) {
      res.send({ message: "Unauthorized Access" });
    } else if (decoded) {
      req._id = decoded.userDB._id;
       console.log(req._id);
      req.username = decoded.userDB.username;
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
// })

app.post("/register", upload.single("image"), async (req, res) => {
  const path = req.file.path;
  var image = path.replace(/\\/g, "/");
  var img = fs.readFileSync(image);

  var encode_image = img.toString("base64");

  // Define a JSONobject for the image attributes for saving to database

  var finalImg = {
    contentType: req.file.mimetype,

    images: Buffer.from(encode_image, "base64"),
  };

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
          var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "manikumar81796@gmail.com",
              pass: "cnnsapjgbrilpywm",
            },
          });

          var mailOptions = {
            from: "manikumar81796@gmail.com",
            to: email,
            subject: "Sending Email using Node.js",
            html: `<div class="card"><h1>PHOTOGRAPHERS HUB</h1>
            <div>
            <p>Thank you for registering....</p>
            <p>Now you became a member of photographers hub</p>
            <img src="cid:firstpic" width="300" height="300">
            </div>
            </div>`,
            attachments: [
              {
                filename: "firstpic.jpeg",
                path: "../assets/images/firstpic.jpeg",
                cid: "firstpic",
              },
            ],
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
            console.log(result);
            res.json({ data: result });
          });
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
id1=userDB._id;
  if (userDB) {
    let Token = jwt.sign({ userDB }, "jeth445", {
      expiresIn: "2h",
    });
    res.cookie("Token", Token);
     console.log(Token);
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});

app.get("/allprofiles",async (req, res) => {
  console.log(req.params.username);
  console.log("hello");
  await UserRegistration.find()
    .then((retrievedata) => {
      
      res.send({ retrievedata: retrievedata, data:id1 });
    })
    .catch((err) => console.log(err));
});

app.delete("/del", async (req, res) => {
  await UserRegistration.deleteMany({})
    .then(() => console.log("hello"))
    .catch((err) => console.log(err));
});

app.get("/edit/:username", async (req, res) => {
  await UserRegistration.findOne({ username: req.params.username })
    .then((retrievedata) => {
      console.log(req.cookies.token);
      res.send({ retrievedata: retrievedata });
    })
    .catch((err) => console.log(err));
});

app.get("/view/:user", async (req, res) => {
  console.log(req.params.user);
  await UserRegistration.findOne({ username: req.params.user })
    .then((retrievedata) => {
      console.log(req.cookies.token);
      res.send({ retrievedata: retrievedata });
    })
    .catch((err) => console.log(err));
});

app.get("/photos/:user", async (req, res) => {
  console.log(req.params.user);
  await ProfilesData.findOne({ username: req.params.user })
    .then((retrievedata) => {
      console.log(req.cookies.token);
      res.send({ retrievedata: retrievedata });
    })
    .catch((err) => console.log(err));
});

app.get("/payment/:user/:date", async (req, res) => {
  console.log(req.params.date);
  await Reserve.findOne({ username1: req.params.user, date: req.params.date })
    .then((retrievedata) => {
      res.send({ retrievedata: retrievedata });
    })
    .catch((err) => console.log(err));
});
app.get("/pgdetails/:username", async (req, res) => {
  await UserRegistration.findOne({ username: req.params.username })
    .then((retrievedata) => {
      res.send({ retrievedata: retrievedata });
    })
    .catch((err) => console.log(err));
});

app.get("/reserved/:username1", async (req, res) => {
  await Reserve.find({ photographername: req.params.username1 })
    .then((retrievedata) => {
      console.log(retrievedata);
      console.log("bye");
      res.send({ retrievedata: retrievedata });
    })
    .catch((err) => console.log(err));
});

app.put("/up/:username", upload.array("image[]", 12), async (req, res) => {
  var files = req.files;
  let image = {};
  let userp = {};
  let res1 = [];
  console.log(files);
  files.forEach((file, i) => {
    const path = file.path;
    image[i] = path.replace(/\\/g, "/");
  });

  const { username, email, phone, Address, City } = req.body;

  const userDb = await UserRegistration.findOne(
    { username },
    { username: 1, _id: 0 }
  );
  userp = await ProfilesData.findOne({ username }, { image: 1, _id: 0 });

  if (
    (await ProfilesData.findOne({ username }, { username: 1, _id: 0 })) == null
  ) {
    const SaveProfiledata = new ProfilesData({
      username: req.body.username,
      email,
      phone,
      Address,
      City,
      image,
    })
      .save()
      .then((result) => {
        res.status(200).json({ updated: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (
    await ProfilesData.findOne({ username }, { username: 1, _id: 0 })
  ) {
    console.log("hello");
    const obj = Object.values(userp.image);
    console.log(obj);
    let arr = [];
    for (i of obj) {
      arr.push(...Object.values(i));
      console.log(arr);
    }

    const obj2 = Object.values(image);
    console.log(obj2);

    let result = [...obj2, ...arr];
    console.log(result);

    const obj3 = Object.assign({}, result);
    console.log(obj3);

    let result1 = [];
    result1.push(obj3);
    console.log(result1);

    ProfilesData.updateOne(
      { username: req.params.username },
      {
        $set: {
          username: req.params.username,
          email: email,
          phone: phone,
          Address: Address,
          City: City,
          image: result1,
        },
      },
      { new: true }
    ).then((result) => {
      UserRegistration.updateOne(
        { username: req.params.username },
        {
          $set: {
            username: req.params.username,
            email: email,
            phone: phone,
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
  }
});

app.post("/reserv", async (req, res) => {
  const { username1, email1, phone1, City, Event, date, photographername } =
    req.body;
  const userDB = await Reserve.findOne({ date });
  console.log(userDB);
  if (userDB) {
    res.send({ message: "failure" });
  } else {
    const Reserve1 = new Reserve({
      username1,
      email1,
      phone1,
      City,
      Event,
      date,
      photographername,
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

app.get("/logout", async (req, res) => {
  res.clearCookie("Token");
  res.json("hello");
});

app.listen(3001, () => {
  console.log("server running.......");
});
