import App from "./index";
import postRouter from "./routes/post";
import sequelize from "./models";

const PORT = process.env.PORT || 4000;

const app = new App().app;

sequelize.sync().then(() => {
  console.log("mysql connected");
});

app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
