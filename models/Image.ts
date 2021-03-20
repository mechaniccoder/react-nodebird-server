import { DataTypes, Model, Sequelize } from 'sequelize';

export class Image extends Model {
  src!: string;
}

export default (sequelize: Sequelize) => {
  Image.init(
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    { sequelize },
  );
};
