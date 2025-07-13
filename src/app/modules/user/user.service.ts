import { IUser } from "./user.interface";
import { User } from "./user.mode";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const user = await User.create({
    name,
    email,
  });
  return user;
};

export const UserServices = {
  createUser,
};

// route matching -> controller -> service -> model -> database/DB
