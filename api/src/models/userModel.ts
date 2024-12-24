import mongoose, { Schema } from "mongoose";
import { Profile } from "passport";

export interface User extends Profile {
  // Additional fields
  _id?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<User>(
  {
    // Passport normalized user profile fields https://www.passportjs.org/reference/normalized-profile/
    provider: { type: String, required: true },
    id: { type: String, required: true },
    displayName: { type: String, required: true },
    username: { type: String },
    name: {
      familyName: { type: String, required: false },
      givenName: { type: String, required: false },
      middleName: { type: String, required: false },
    },
    emails: [
      {
        value: { type: String, required: false },
        type: { type: String },
      },
    ],
    photos: [
      {
        value: { type: String, required: false },
      },
    ],
  },
  {
    timestamps: true, // Automatically handle `createdAt` and `updatedAt` fields
  }
);

// Create a compound unique index on provider and id
UserSchema.index({ provider: 1, id: 1 }, { unique: true });

export const User = mongoose.model<User>("User", UserSchema);
