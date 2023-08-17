import { type UpdateQuery, type FilterQuery, type QueryOptions } from 'mongoose';
import UserModel, { type User } from '../model/user.model';

export const createUser = async (input: Partial<User>) => {
  return await UserModel.create(input);
};
export const findUser = async (filterQuery: FilterQuery<User>, queryOptions: QueryOptions<User> = {}) => {
  return await UserModel.findOne(filterQuery, queryOptions);
};

export const findAndUpdate = async (
  filteQuery: FilterQuery<User>,
  updateQuery: UpdateQuery<User>,
  queryOptions: QueryOptions<User> = {}
) => {
  return await UserModel.findOneAndUpdate(filteQuery, updateQuery, queryOptions);
};
