import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import mongoose from 'mongoose';

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
}

const ProductModel = getModelForClass(Product);
export default ProductModel;
