import { DataTypes, Model, Sequelize } from 'sequelize';

export class Comment extends Model {
  content!: string;
}

export default (sequelize: Sequelize) => {
  Comment.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { sequelize },
  );
};
