import {DataTypes, Model, Sequelize} from "sequelize";

export default (sequelize: Sequelize) => {
  class Post extends Model {
    content!: string;
  }

  Post.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {sequelize}
  );
};
