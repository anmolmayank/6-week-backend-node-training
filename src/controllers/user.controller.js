import * as response from "../utils/response.js";
import * as userService from "../services/user.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const users =  userService.getUsers();

    response.ok(res, users, "Users fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    response.created(res, user, "User created successfully");
  } catch (error) {
    next(error);
  }
};

export const getUserById = (req, res, next) => {
  try {
    const { id } = req.params;

    const user = userService.getUserById(id);

    return response.ok(res, user, "User fetched successfully");
  } catch (error) {
    next(error);
  }
};
