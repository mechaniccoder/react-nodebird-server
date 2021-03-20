import passport from "passport";
import { User } from "../models/User";

export default () => {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: any, done) => {
    try {
      const user = await User.findOne({
        where: {
          id,
        },
      });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
