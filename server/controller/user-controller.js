import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.js";
import Token from "../model/token.js";
import { response } from "express"; // Make sure to import 'response' for proper typing
dotenv.config();

export const signupUser = async (request, response) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    // Create a new user
    const user = {
      username: request.body.username,
      name: request.body.name,
      password: hashedPassword,
    };

    const newUser = new User(user);
    await newUser.save();
    return response.status(200).send({ msg: "Signup successful" });
  } catch (e) {
    console.error(e); // Log the error for debugging
    return response.status(500).send({ msg: "Error while signing up the user" });
  }
};

export const loginUser = async (request, response) => {
  try {
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
      return response.status(400).json({ msg: "Username does not match" });
    }

    // Compare the password
    let match = await bcrypt.compare(request.body.password, user.password);
    if (match) {
      const accessToken = jwt.sign(
        user.toJSON(),
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        user.toJSON(),
        process.env.REFRESH_SECRET_KEY
      );

      // Save refresh token to the database
      const newToken = new Token({ token: refreshToken });
      await newToken.save();

      // Set refresh token in HttpOnly cookie for security
      response.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Make it accessible only by the backend
        secure: process.env.NODE_ENV === "production", // Use https in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      });

      return response.status(200).json({
        accessToken: accessToken,
        name: user.name,
        username: user.username,
      });
    } else {
      return response.status(400).json({ msg: "Password does not match" });
    }
  } catch (e) {
    console.error(e); // Log error for debugging
    return response.status(500).json({ msg: "Error while logging in user" });
  }
};
