import { expressjwt } from "express-jwt";

export const validJwt = expressjwt({
  getToken: (req, res) => req.cookies.token,
  algorithms: ["HS256"],
  secret: process.env.JWT_SECRET,
});
