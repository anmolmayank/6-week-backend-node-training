import usersData from "../mockdata/userData.js";

export const getUsers = () => {
  return usersData;
};

export const createUser = (user) => {
  const newUser = {
    id: usersData.length + 1,

    ...user,
  };

  usersData.push(newUser);

  return newUser;
};

export const getUserById = (id) => {
  const user = usersData.find((user) => user.id === Number(id));

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, `User with id ${id} not found`);
  }

  return user;
};
