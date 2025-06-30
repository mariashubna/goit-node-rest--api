import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";
import { emailRegexp, passRegexp } from "../constants/auth.js";

const User = sequelize.define("user", {
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: passRegexp,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: emailRegexp,
    },
  },
  subscription: {
    type: DataTypes.ENUM,
    values: ["starter", "pro", "business"],
    defaultValue: "starter",
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  avatarURL: { type: DataTypes.STRING, allowNull: false },
});

User.sync({ alter: true });

export default User;
