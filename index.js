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
const messageContact = require('./routes/others/message');
const counts = require("./models/counts")
const Orders = require('./models/orders')
const employeeSchema = require('./models/employee')
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
app.get("/", async (req, res) => {
    // const employee1 = new employeeSchema({
    //   name: "Angela Pablo",
    //   userName: "E101",
    //   password: "Angela@1234",
    //   role: "products"
    // });
    // employee1.save();
    // const employee2 = new employeeSchema({
    //   name: "Thor Odinson",
    //   userName: "E102",
    //   password: "Thor@1234",
    //   role: "serviceAppointment"
    // });
    // employee2.save();
    // const employee3 = new employeeSchema({
    //   name: "Hela pattinson",
    //   userName: "E103",
    //   password: "Hela@1234",
    //   role: "doctorAppointment"
    // });
    // employee3.save();
    let notlogin = true
    const count = await counts.findOne({countId: "message"});
    const countView = count.countViews + 1;
    await counts.findOneAndUpdate({countId: "message"}, {countViews: countView});
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

app.use('/others', messageContact);

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