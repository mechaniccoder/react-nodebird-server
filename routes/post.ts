import express, { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { Image } from '../models/Image';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { isLoggedIn } from './middlewares';

const router = express.Router();

router.post('/', isLoggedIn, async (req: Request, res: Response) => {
  try {
    const { content, id } = req.body;

    const post = await Post.create(
      {
        content: content,
        UserId: id,
      },
      {
        include: [
          {
            model: Comment,
          },
          {
            model: Image,
          },
        ],
      },
    );
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
          include: [
            {
              model: User,
              attributes: {
                exclude: ['password'],
              },
            },
          ],
        },
        {
          model: User,
          as: 'LikeUsers',
          attributes: ['id'],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(400).send('Fail to fetch posts');
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    const PostId = Number(req.params.postId);
    await Post.destroy({
      where: {
        id: PostId,
      },
    });

    res.json({ PostId });
  } catch (error) {
    next(error);
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

    const newComment = await Comment.create({
      content,
      PostId: Number(postId),
      UserId: (user as any).id,
    });

    const addedComment = await Comment.findOne({
      where: {
        id: (newComment as any).id,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    });
    res.status(201).json(addedComment);
  } catch (error) {
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const PostId = Number(req.params.postId);
    const exPost = await Post.findOne({
      where: {
        id: PostId,
      },
    });

    if (!exPost) {
      return res.status(403).send('???????????? ?????? ??????????????????.');
    }

    const result = await (exPost as any).addLikeUsers((req.user as any).id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:postId/unlike', isLoggedIn, async (req, res, next) => {
  try {
    const PostId = Number(req.params.postId);
    const exPost = await Post.findOne({
      where: {
        id: PostId,
      },
    });

    if (!exPost) {
      return res.status(403).send('???????????? ?????? ??????????????????.');
    }

    await (exPost as any).removeLikeUsers((req.user as any).id);
    res.status(201).json({ PostId, UserId: (req.user as any).id });
  } catch (error) {
    next(error);
  }
});

export default router;
