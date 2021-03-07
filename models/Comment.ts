import {DataTypes, Model, Sequelize} from "sequelize";

export default (sequelize: Sequelize) => {
  class Comment extends Model {
    content!: string;
  }

  Comment.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {sequelize}
  );
};
