import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { User } from './user.model';

export enum Category {
  Earphones = 'earphones',
  Headphones = 'headphones',
  Speakers = 'speakers',
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  @prop({ required: true, unique: true })
  public name: string;

  @prop({ required: true })
  public price: number;

  @prop({ required: true })
  public category: Category;

  @prop({ required: true })
  public description: string;

  @prop({ required: true })
  public feature: string;

  @prop({ type: String, required: true, default: [] })
  public boxContent!: mongoose.Types.Array<{
    quantity: number;
    name: string;
  }>;

  @prop()
  public imagePath: string;

  @prop({ ref: () => User, required: true })
  public createdBy: Ref<User>;
}

const ProductModel = getModelForClass(Product);
export default ProductModel;
