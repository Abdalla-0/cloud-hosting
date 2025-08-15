/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";
import { serialize } from "cookie";

// generate new token
export const generateJWT = (jwtPayload: JWTPayload): string => {
  return jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// store token in cookie

export const setCookie = (jwtPayload: JWTPayload): string => {
  const token = generateJWT(jwtPayload);

  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return cookie;
};

// Verify Token For API End Point
export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    const jwtToken = request.cookies.get("token");
    const token = jwtToken?.value as string;
    if (!token) return null;

    const privateKey = process.env.JWT_SECRET as string;
    const userPayload = jwt.verify(token, privateKey) as JWTPayload;

    return userPayload;
  } catch (error) {
    return null;
  }
}

// Verify Token For Page
export function verifyTokenForPage(token: string): JWTPayload | null {
  try {
    const privateKey = process.env.JWT_SECRET as string;
    const userPayload = jwt.verify(token, privateKey) as JWTPayload;
    if (!userPayload) return null;

    return userPayload;
  } catch (error) {
    return null;
  }
}
