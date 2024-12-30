import passport, { Profile } from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import { User } from "../models/userModel";

export const passportConfig = () => {
  //* GOOGLE
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if the user already exists
          const existingUser = await User.findOne({
            id: profile.id,
            provider: profile.provider,
          });

          // If the user already exists, return it
          if (existingUser) {
            return done(null, existingUser);
          }

          // If the user doesn't exist, create a new one
          const newUser = new User({
            id: profile.id as string,
            provider: profile.provider,
            displayName: profile.displayName,
            username: profile.username,
            name: profile.name,
            emails: profile.emails,
            photos: profile.photos,
          });

          await newUser.save();
          return done(null, newUser);
        } catch (err) {
          console.error("Error during Google authentication:", err);
          return done(err);
        }
      }
    )
  );

  //* GitHub
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        callbackURL: process.env.GITHUB_CALLBACK_URL || "",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          // Check if the user already exists
          const existingUser = await User.findOne({
            id: profile.id,
            provider: profile.provider,
          });

          // If the user already exists, return it
          if (existingUser) {
            return done(null, existingUser);
          }

          // If the user doesn't exist, create a new one
          const newUser = new User({
            id: profile.id as string,
            provider: profile.provider,
            displayName: profile.displayName,
            username: profile.username,
            name: profile.name,
            emails: profile.emails,
            photos: profile.photos,
          });

          await newUser.save();
          return done(null, newUser);
        } catch (err) {
          console.error("Error during GitHub authentication:", err);
          return done(err);
        }
      }
    )
  );

  // Serialize and deserialize the user for session management
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findOne({ id }).lean();
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};
