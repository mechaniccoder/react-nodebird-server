import express, {NextFunction, Request, Response} from "express";
import bcrypt from "bcrypt";
import db from "../models";
import {User} from "../models/User";

const router = express.Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const {email, nickname, password} = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log(req.body);
      const user = await User.create({
        email,
        nickname,
        password: hashedPassword,
      });

      res.status(200).send("ok");
    } catch (error) {
      res.status(401).json(error.message);
    }
  }
);

export default router;
