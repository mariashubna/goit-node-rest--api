import express from "express";
import validateBody from "../helpers/validateBody.js";
import { authSchema } from "../schemas/authSchema.js";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(authSchema),
  authController.registerController
);

authRouter.post(
  "/login",
  validateBody(authSchema),
  authController.loginController
);

export default authRouter;
