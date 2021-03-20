import { DataTypes, Model, Sequelize } from "sequelize";
export class Post extends Model {
  content!: string;
}

export default (sequelize: Sequelize) => {
  Post.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { sequelize }
  );
};
