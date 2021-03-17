import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import passport from "passport";
import { Post } from "../models/Post";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  const { email, nickname, password } = req.body;

  try {
    const exUser = await User.findOne({
      where: {
        email,
      },
    });
    if (exUser) {
      return res.status(403).json("user exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      nickname,
      password: hashedPassword,
    });

    res.status(200).send("user created");
  } catch (error) {
    res.status(401).json(error.message);
  }
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    if (info) {
      console.log(info);
      return res.status(401).send(info.message);
    }

    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }

      const filterdUser = await User.findOne({
        where: {
          id: user.id,
        },
        attributes: {
          exclude: ["password"],
        },
        include: [
          Post,
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });

      return res.status(200).json(filterdUser);
    });
  })(req, res, next);
});

export default router;
