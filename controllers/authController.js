import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { registerUser, loginUser } from "../services/authServices.js";

const registerController = async (req, res, next) => {
  try {
    const newUser = await registerUser(req.body);

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      throw HttpError(409, "Email in use");
    }
    throw err;
  }
};
const loginController = async (req, res, next) => {
  const token = await loginUser(req.body);
  res.json({ token });
};

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
};
