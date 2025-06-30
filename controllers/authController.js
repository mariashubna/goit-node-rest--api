import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  changeSubscription,
  changeAvatar,
} from "../services/authServices.js";

import { rename } from "node:fs/promises";
import { resolve, join } from "node:path";

const avatarDir = resolve("public", "avatars");

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
  const { token, user } = await loginUser(req.body);
  res.json({ token, user });
};

const getCurrentController = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logoutController = async (req, res, next) => {
  await logoutUser(req.user);
  res.status(204).json("No Content");
};

const subscriptionController = async (req, res, next) => {
  const { id } = req.user;
  const { subscription } = req.body;

  if (!["starter", "pro", "business"].includes(subscription)) {
    throw HttpError(400, "Invalid subscription value");
  }

  const updatedUser = await changeSubscription(id, subscription);
  res.json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

const avatarsController = async (req, res, next) => {
  let avatar = null;
  const { id } = req.user;
  if (req.file) {
    const { path: oldPath, filename } = req.file;
    const newPath = join(avatarDir, filename);
    await rename(oldPath, newPath);
    avatar = join("public", "avatars", filename);
    const changedAvatar = changeAvatar(id, avatar);
  }
  const { avatarURL } = req.user;
  res.json({
    avatarURL,
  });
};

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  getCurrentController: ctrlWrapper(getCurrentController),
  logoutController: ctrlWrapper(logoutController),
  subscriptionController: ctrlWrapper(subscriptionController),
  avatarsController: ctrlWrapper(avatarsController),
};
