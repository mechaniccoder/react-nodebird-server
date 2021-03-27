import express from 'express';
import passport from 'passport';
import App from './index';
import postRouter from './routes/post';
import { sequelize } from './models';
import authRouter from './routes/auth';
import cors from 'cors';
import session from 'express-session';
import local from './passport/local';
import passportConfig from './passport';
import logger from 'morgan';

const PORT = process.env.PORT || 4000;

const app = new App().app;

sequelize.sync().then(() => {
  console.log('mysql connected');
});

app.use(logger('dev'));

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(
  session({
    secret: 'node-bird',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// passport
app.use(passport.initialize());
app.use(passport.session());

passportConfig();
local();

app.use('/auth', authRouter);
app.use('/post', postRouter);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
