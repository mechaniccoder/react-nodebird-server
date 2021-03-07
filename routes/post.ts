import express, {Request, Response} from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({id: 1, content: "hi"});
});

router.get("/", (req: Request, res: Response) => {
  res.status(200);
});

export default router;
