import jwt from "jsonwebtoken";
import User from "../models/user";
import { comparePassword, hashPassword } from "../utils";

export const signup = async (req, res) => {
  try {
    const { name, email, password, accountType, address } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists.");
    }

    const hashedPassword = await hashPassword(password);

    await new User({
      name,
      email,
      password: hashedPassword,
      category: accountType,
      address,
    }).save();

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  console.log(req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne(
      { email },
      {
        _id: 1,
        name: 1,
        password: 1,
        email: 1,
        log_in_time: 1,
        category: 1,
        address: 1,
      }
    );
    console.log("user: =================>", user);
    const logInTime = Date.now();

    await User.findOneAndUpdate(
      {
        email,
      },
      {
        log_in_time: logInTime,
      }
    );

    if (!user) {
      return res.status(400).send("User not found!");
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send("Incorrect Password.");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { httpOnly: true });
    console.log(token);
    user.password = undefined;
    user.log_in_time = logInTime;
    res.send({ user });
  } catch (err) {
    console.log(err);
  }
};

export const logout = async (req, res) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const { userId } = req.body;
    console.log(userId);
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { log_in_time: 0 } }
    );
    res.clearCookie("token");
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const getSessionStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.findOne({ _id: userId }, { log_in_time: 1 });
    console.log("get session status: ====> ", userData);
    if (userData.log_in_time + 86400000 < Date.now()) {
      return res.json({ ok: false });
    } else {
      return res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};
