const express = require("express")
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const path = require("path")
const authRouter = require("./routes/auth/authRoutes");
const dogsPage = require("./routes/pages/dogs");
const catsPage = require("./routes/pages/cats")
const birdsPage = require("./routes/pages/birds")
const fishPage = require("./routes/pages/fish")
const servicePage = require("./routes/pages/services")
const productsPage = require("./routes/pages/products")
const vetcarePage = require("./routes/pages/vetcare")
const petfoodPage = require("./routes/pages/petfood")
const userProfile = require("./routes/profiles/userProfile")
const userPayment = require("./routes/payments/payment")
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const profilesRoutes = require("./routes/profiles/profilesRoutes");
const messgaeContact = require('./routes/others/message');

app.use(session({
    secret: "some secret",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
    resave: true,
    saveUninitialized: false,
}))

app.use(cookieParser())

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/client"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }))

//Static files are files that clients download from the server
app.use(express.static("client"));

//authRouter is called everytime the /auth is used in the server
//Runs on every url but works only when specified path is matched in the url 
app.use("/auth", authRouter);
app.get("/", (req, res) => {
    let notlogin = true
    console.log(req.session.userName);
    if (req.session.userName) {
        notlogin = false
    }
    res.render("./HTML/LandingPages/mainLandingPage.ejs", { error: false, notlogin });
});

app.use("/profile", profilesRoutes);
app.use("/dogs", dogsPage)
app.use("/cats", catsPage)
app.use("/birds", birdsPage)
app.use("/fish", fishPage)
app.use("/services", servicePage)
app.use("/products", productsPage)
app.use("/vet-care", vetcarePage)
app.use("/petsfoods", petfoodPage)
app.use("/user/profile", userProfile)
app.use("/user/payment", userPayment)

app.use('/others', messgaeContact);

mongoose
  .connect(
    "mongodb+srv://petparadise:Petparadise@cluster0.zuw8xzo.mongodb.net/test"
  )
  .then((result) => {
    app.listen(8000);
    console.log("server started successfully!");
  })
  .catch((err) => {
    console.log(err);
  });