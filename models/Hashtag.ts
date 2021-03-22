import { DataTypes, Model, Sequelize } from 'sequelize';

export class Hashtag extends Model {
  tag!: string;
}

export default (sequelize: Sequelize) => {
  Hashtag.init(
    {
      tag: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    { sequelize },
  );
};
