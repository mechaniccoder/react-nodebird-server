import {DataTypes, Model, Sequelize} from "sequelize";

export default (sequelize: Sequelize) => {
  class Image extends Model {
    src!: string;
  }

  Image.init(
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {sequelize}
  );
};
