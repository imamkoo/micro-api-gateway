require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const mediaRouter = require("./routes/media");
const courseRouter = require("./routes/course");
const chaptersRouter = require("./routes/chapters");
const lessonsRouter = require("./routes/lessons");
const orderPaymentsRouter = require("./routes/orderPayments");
const refreshTokenRouter = require("./routes/refreshTokens");
const mentorsRouter = require("./routes/mentors");
const imageCoursesRouter = require("./routes/imageCourses");
const myCoursesRouter = require("./routes/myCourses");
const reviewsRouter = require("./routes/reviews");
const webhookRouter = require("./routes/webhook");

const verifyToken = require("./middlewares/verifyToken");
const permission = require("./middlewares/permission");

const app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/course", courseRouter);
app.use("/refresh-tokens", refreshTokenRouter);
app.use("/media", verifyToken, permission("admin", "student"), mediaRouter);
app.use("/chapters", verifyToken, permission("admin"), chaptersRouter);
app.use("/lessons", verifyToken, permission("admin"), lessonsRouter);
app.use("/mentors", verifyToken, permission("admin"), mentorsRouter);
app.use("/reviews", verifyToken, permission("admin", "student"), reviewsRouter);
app.use(
  "/orders",
  verifyToken,
  permission("admin", "student"),
  orderPaymentsRouter
);
app.use("/image-courses", permission("admin"), verifyToken, imageCoursesRouter);
app.use(
  "/my-courses",
  verifyToken,
  permission("admin", "student"),
  myCoursesRouter
);
app.use("/webhook", webhookRouter);

module.exports = app;
