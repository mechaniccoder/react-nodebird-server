import express from "express";
import App from "./index";
import postRouter from "./routes/post";
import {sequelize} from "./models";
import authRouter from "./routes/auth";
import cors from "cors";

const PORT = process.env.PORT || 4000;

const app = new App().app;

sequelize.sync().then(() => {
  console.log("mysql connected");
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
