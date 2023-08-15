import UserModel, { type User } from '../model/user.model';

export const createUser = async (input: Partial<User>) => {
  return await UserModel.create(input);
};
export const findOneByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};
