const passport = require("passport");
const User = require("../model/userModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const { displayName, emails, photos } = profile;

        let user = await User.findOne({ email: emails[0].value });

        if (user) {
          if (!user.profilePicture) {
            user.profilePicture = photos[0]?.value;
            await user.save();
          }
        } else {
          user = await User.create({
            username: displayName,
            email: emails[0]?.value,
            profilePicture: photos[0]?.value,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
