import express from "express";

import {
  getUsers,
  createUser,
  getUserById,
} from "../controllers/user.controller.js";

import validateUser from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);

router.post("/", validateUser, createUser);

export default router;
