import express, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import passport from 'passport';
import { Post } from '../models/Post';
import { isLoggedIn, isNotLoggedIn } from './middlewares';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findOne({
        where: {
          id: (req.user as any).id,
        },
        attributes: {
          exclude: ['password'],
        },
        include: [
          {
            model: Post,
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          },
          {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          },
        ],
      });
      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    res.status(404).send('User not found');
  }
});

router.post('/signup', isNotLoggedIn, async (req: Request, res: Response) => {
  const { email, nickname, password } = req.body;

  try {
    const exUser = await User.findOne({
      where: {
        email,
      },
    });
    if (exUser) {
      return res.status(403).json('user exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      nickname,
      password: hashedPassword,
    });

    res.status(200).json('user created');
  } catch (error) {
    res.status(401).json(error.message);
  }
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(401).json(err.message);
    }

    if (info) {
      console.log(info);
      return res.status(401).json(info.message);
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
          exclude: ['password'],
        },
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: 'Followings',
          },
          {
            model: User,
            as: 'Followers',
          },
        ],
      });

      return res.status(200).json(filterdUser);
    });
  })(req, res, next);
});

router.post('/logout', isLoggedIn, (req: Request, res: Response) => {
  req.logOut();
  req.session.destroy((err) => {
    res.status(403).json(err);
  });
  res.send('ok');
});

router.patch('/nickname', async (req, res, next) => {
  const { nickname } = req.body;
  try {
    await User.update(
      { nickname },
      {
        where: {
          id: (req.user! as any).id,
        },
      },
    );
    res.status(201).json({ nickname: req.body.nickname });
  } catch (err) {
    next(err);
  }
});

export default router;
