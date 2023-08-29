import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public price: number;

  @prop({ required: true })
  public description: string;

  @prop({ required: true })
  public feature: string;

  @prop()
  public boxContent: {
    quantity: number;
    name: string;
  };

  @prop()
  public imagePath: string;
}

const ProductModel = getModelForClass(Product);
export default ProductModel;
