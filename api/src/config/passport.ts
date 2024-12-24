import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User, IUser } from "../models/userModel";

passport.serializeUser((user: IUser, done) => {
  process.nextTick(() => {
    done(null, { id: user.id, name: user.name });
  });
});

passport.deserializeUser((user: any, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile"],
      state: true,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        // Check for existing federated credentials
        const existingUser = await User.findOne({
          "federated.provider": "https://accounts.google.com",
          "federated.subject": profile.id,
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create new user if none exists
        const newUser = await User.create({
          name: profile.displayName,
          federated: [
            {
              provider: "https://accounts.google.com",
              subject: profile.id,
            },
          ],
        });

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);
