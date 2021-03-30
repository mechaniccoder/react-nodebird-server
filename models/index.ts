import { Sequelize } from 'sequelize';
import configOptions from '../config/config';
import createUser from './User';
import createPost from './Post';
import createComment from './Comment';
import createImage from './Image';
import createHashtag from './Hashtag';

type Env = 'development' | 'test' | 'production';
const env: Env = (process.env.NODE_ENV as Env) || 'development';

const config = configOptions[env];

export const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect as 'mysql',
});

createUser(sequelize);
createPost(sequelize);
createComment(sequelize);
createImage(sequelize);
createHashtag(sequelize);

export const { User, Post, Comment, Hashtag, Image } = sequelize.models;

User.hasMany(Post);
User.hasMany(Comment);
User.belongsToMany(Post, { through: 'Like', as: 'LikePosts' });
User.belongsToMany(User, {
  through: 'Follow',
  as: 'Followers',
  foreignKey: 'FollowingId',
});
User.belongsToMany(User, {
  through: 'Follow',
  as: 'Followings',
  foreignKey: 'FollowerId',
});

Post.belongsTo(User);
Post.hasMany(Comment);
Post.hasMany(Image);
Post.belongsToMany(Hashtag, { through: 'PostHashtag' });
Post.belongsToMany(User, { through: 'Like', as: 'LikeUsers' });
Post.belongsTo(Post, { as: 'Retweet' });

Comment.belongsTo(User);
Comment.belongsTo(Post);

Hashtag.belongsToMany(Post, { through: 'PostHashtag' });

Image.belongsTo(Post);

export default sequelize.models;
