import { type UpdateQuery, type FilterQuery, type QueryOptions } from 'mongoose';
import ProductModel, { type Product } from '../model/product.model';

export const createProduct = async (input: Partial<Product>) => {
  return await ProductModel.create(input);
};
export const findProduct = async (filterQuery: FilterQuery<Product>, queryOptions: QueryOptions<Product> = {}) => {
  return await ProductModel.findOne(filterQuery, queryOptions);
};
export const deleteProduct = async (filterQuery: FilterQuery<Product>, queryOptions: QueryOptions<Product> = {}) => {
  return await ProductModel.deleteOne(filterQuery, queryOptions);
};

export const findAndUpdateProduct = async (
  filteQuery: FilterQuery<Product>,
  updateQuery: UpdateQuery<Product>,
  queryOptions: QueryOptions<Product> = {}
) => {
  return await ProductModel.findOneAndUpdate(filteQuery, updateQuery, queryOptions);
};
