import express from "express";
import passport from "passport";
import App from "./index";
import postRouter from "./routes/post";
import { sequelize } from "./models";
import authRouter from "./routes/auth";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import local from "./passport/local";
import passportConfig from "./passport";

const PORT = process.env.PORT || 4000;

const app = new App().app;

sequelize.sync().then(() => {
  console.log("mysql connected");
});

passportConfig();
local();

app.use(cors());
// app.use(cookieParser());
app.use(
  session({
    secret: "node-bird",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
