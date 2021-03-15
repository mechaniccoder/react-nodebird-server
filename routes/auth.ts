import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";

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

export default router;
