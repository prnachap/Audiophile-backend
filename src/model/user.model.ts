import { prop, getModelForClass, pre, type DocumentType, modelOptions, Severity, type Ref } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import logger from '../../logger';
import { Product } from './product.model';

@pre<User>('save', async function () {
  if (!this.password) return;
  if (!this.isModified('password')) return;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
})
@modelOptions({ schemaOptions: { timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class User {
  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public email: string;

  @prop()
  public password?: string;

  @prop({ required: true, default: () => uuidv4() })
  public verificationCode: string;

  @prop()
  public passwordTokenExpiry: Date;

  @prop()
  public verificiationTokenExpiry: Date;

  @prop({ default: false })
  public verified: boolean;

  @prop()
  public passwordResetCode: string | null;

  @prop({ default: 'buyer' })
  public userRole: string;

  @prop({ ref: () => Product })
  public products: Array<Ref<Product>>;

  async validatePassword(this: DocumentType<User>, candidatePassword: string): Promise<boolean | undefined> {
    try {
      return await bcrypt.compare(candidatePassword, this.password as string);
    } catch (error) {
      logger.error(error, 'could not validate password');
      return false;
    }
  }
}

const UserModel = getModelForClass(User);
export default UserModel;
