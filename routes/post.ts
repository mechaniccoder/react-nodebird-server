import express, { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { Image } from '../models/Image';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { isLoggedIn } from './middlewares';

const router = express.Router();

router.post('/', isLoggedIn, async (req: Request, res: Response) => {
  console.log('post', req.session);
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
      attributes: {
        exclude: ['password'],
      },
    });

    res.status(201).json({ ...post.get(), User: user });
  } catch (err) {
    console.log(err);
    res.status(403).send('Fail to create Post');
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: Image,
        },
        {
          model: Comment,
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(400).send('Fail to fetch posts');
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const { content } = req.body;
    const user = req.user;
    const { postId } = req.params;

    const exPost = await Post.findOne({
      where: {
        id: postId,
      },
    });
    if (!exPost) {
      return res.status(403).send('Post not found');
    }

    const newComment = await Comment.create(
      {
        content,
        PostId: postId,
        UserId: (user as any).id,
      },
      {
        include: [
          {
            model: User,
          },
        ],
      },
    );
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

export default router;
