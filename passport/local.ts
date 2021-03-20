import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import { User } from '../models/User';

export default () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },

      async (email: string, password: string, done: any) => {
        console.log(email);
        try {
          const exUser = await User.findOne({
            where: {
              email,
            },
          });

          if (!exUser) return done(null, false, { message: '존재하지 않는 이메일입니다.' });

          const result = await bcrypt.compare(password, exUser.password);
          if (!result) return done(null, false, { message: '비밀번호가 일치하지않습니다.' });

          return done(null, exUser);
        } catch (error) {
          console.log(error);
          return done(error);
        }
      },
    ),
  );
};
