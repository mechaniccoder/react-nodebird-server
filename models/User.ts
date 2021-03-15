import { DataTypes, Model, Sequelize } from "sequelize";

export class User extends Model {
  nickname!: string;
  email!: string;
  password!: string;
}

export default (sequelize: Sequelize) => {
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
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
    },
    {
      sequelize,
      charset: "utf8",
    }
  );
};
