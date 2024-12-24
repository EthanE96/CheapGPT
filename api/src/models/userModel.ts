import mongoose, { Schema } from "mongoose";

interface IFederatedCredential {
  provider: string;
  subject: string;
}

export interface IUser extends Document {
  name: string;
  federated: IFederatedCredential[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    federated: [
      {
        provider: { type: String, required: true },
        subject: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

userSchema.index({ "federated.provider": 1, "federated.subject": 1 });
export const User = mongoose.model<IUser>("User", userSchema);
