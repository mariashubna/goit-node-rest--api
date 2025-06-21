import User from "../db/users.js";
import bcrypt from "bcrypt";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const registerUser = async (payload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);

  return User.create({ ...payload, password: hashPassword });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });
  if (!user) throw HttpError(401, "Email or password is wrong");

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) throw HttpError(401, "Email or password is wrong");

  const payload = {
    id: user.id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

  return token;
};
