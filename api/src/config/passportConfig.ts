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
        callbackURL:
          `${process.env.API_URL}${process.env.GOOGLE_CALLBACK_ENDPOINT}` || "",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user;

          // Check if the user already exists
          const existingUser = await User.findOne({
            id: profile.id,
            provider: profile.provider,
          });

          if (existingUser) {
            user = existingUser;
          } else {
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
            user = await newUser.save();
          }
          return done(null, user);
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
        callbackURL:
          `${process.env.API_URL}${process.env.GITHUB_CALLBACK_ENDPOINT}` || "",
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
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      // Use MongoDB's _id to find the user
      const user = await User.findById(id).lean();
      if (!user) {
        console.error("No user found during deserialization");
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error("Error during deserialization:", error);
      done(error);
    }
  });
};
