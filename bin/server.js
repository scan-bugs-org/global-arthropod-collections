const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const nunjucks = require("nunjucks");
const nunjucksDateFilter = require("nunjucks-date-filter");
const path = require("path");
const session = require("express-session");
const uuid = require("uuid");

const geoJsonRouter = require("../controllers/geojson");
const listViewRouter = require("../controllers/list");
const collectionEditRouter = require("../controllers/editCollection");
const institutionEditRouter = require("../controllers/editInstitution");
const loginRouter = require("../controllers/login");

const database = require("../include/database");
const User = database.User;
const getSessionKey = require("../include/serverSessionKey");
const authMiddleware = require("../include/common").protectRoute;

const PORT = 8080;
const SESSION_KEY_PATH = path.resolve(__dirname, "..", "data", ".session");
const isDev = process.env.NODE_ENV === "development";

// Create admin user
User.findById("admin").then((user) => {
  if (user === null) {
    const userPass = uuid.v4();
    console.log(`The admin password is ${userPass}. Please change this.`);
    user = new User({ _id: "admin", password: userPass });
    user.save();

  } else {
    console.log("The admin user already exists, skipping creation...");
  }
}).catch((err) => {
  console.error(`Error creating admin user: ${err.reason}`);
});

// Configure app
const app = express();
app.use(logger(isDev ? "dev" : "tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure sessions
const sessionKey = getSessionKey(SESSION_KEY_PATH);
app.use(session({
  secret: sessionKey,
  store: database.sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    name: "bug-collections",
    proxy: true,
    sameSite: true,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development"
  }
}));

// Configure views
const nunjucksEnv = nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: isDev
});
nunjucksEnv.addFilter("date", nunjucksDateFilter);

// Unprotected
app.use("/geojson", geoJsonRouter);

app.use("/login", loginRouter);
app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err !== null) {
        console.error(`Error destroying session: ${err}`);
      }
    });
  }
  res.redirect("/");
});

// Protected
app.use("/edit", authMiddleware);
app.use("/edit/collections", collectionEditRouter);
app.use("/edit/institutions", institutionEditRouter);
app.use("/edit", listViewRouter);

// Static files
app.use(express.static(path.resolve(__dirname, "..", "public")));

// Redirect to home on 404
app.use("*", (req, res) => res.redirect("/"));

// Start app
app.listen(PORT, () => console.info(`Server listening on port ${PORT}...`));
