/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/utils/db";
import { RegisterUserDto } from "@/utils/dtos";
import { registerSchema } from "@/utils/validation/auth";
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "@/utils/token";
import { hashPassword } from "@/utils/crypto";

/**
 ***  @desc create new user
 ***  @route /api/users/register
 ***  @method POST
 ***  @access public
 **/
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterUserDto;
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (user) {
      return NextResponse.json(
        { message: "user alreadey exist!" },
        { status: 400 }
      );
    }
    const hashedPassword = await hashPassword(body.password);
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        isAdmin: true,
      },
    });

    const cookie = setCookie({
      id: newUser.id,
      username: newUser.username,
      isAdmin: newUser.isAdmin,
    });

    return NextResponse.json(
      { ...newUser, message: "account created successfully" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
