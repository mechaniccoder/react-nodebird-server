import {DataTypes, Model, Sequelize} from "sequelize";

export default (sequelize: Sequelize) => {
  class Hashtag extends Model {
    tag!: string;
  }

  Hashtag.init(
    {
      tag: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {sequelize}
  );
};
