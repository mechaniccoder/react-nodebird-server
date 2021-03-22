import express, { Request, Response } from 'express';
import { Post } from '../models/Post';
import { User } from '../models/User';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { content, id } = req.body;

    const post = await Post.create({
      content: content,
      UserId: id,
    });
    const user = await User.findOne({
      where: {
        id,
      },
    });

    res.status(201).json({ ...post.get(), User: user });
  } catch (err) {
    console.log(err);
    res.status(403).send('Fail to create Post');
  }
});

router.get('/', (req: Request, res: Response) => {
  res.status(200);
});

export default router;
