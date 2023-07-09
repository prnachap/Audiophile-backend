import { prop, getModelForClass, pre, type DocumentType, modelOptions, Severity } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';
import argon2 from 'argon2';
import logger from '../../logger';

@pre<User>('save', async function () {
  if (!this.password) return;
  if (!this.isModified('password')) return;
  const hash = await argon2.hash(this.password);
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

  @prop({ default: false })
  public verified: boolean;

  @prop()
  public passwordResetCode: string | null;

  async validatePassword(this: DocumentType<User>, candidatePassword: string): Promise<boolean> {
    try {
      return await argon2.verify(this.password as string, candidatePassword);
    } catch (error) {
      logger.error(error, 'could not validate password');
      return false;
    }
  }
}

const UserModel = getModelForClass(User);
export default UserModel;