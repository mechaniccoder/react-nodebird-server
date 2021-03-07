import {DataTypes, Model, Sequelize} from "sequelize";
import Post from "./Post";

export default (sequelize: Sequelize) => {
  class User extends Model {
    nickname!: string;
    email!: string;
    password!: string;
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      charset: "utf8",
    }
  );
};
