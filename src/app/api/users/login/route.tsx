/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/utils/db";
import { LoginUserDto } from "@/utils/dtos";
import { loginSchema } from "@/utils/validation/auth";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "@/utils/token";

/**
 ***  @desc login user
 ***  @route /api/users/login
 ***  @method POST
 ***  @access puplic
 **/
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginUserDto;
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user) {
      return NextResponse.json(
        { message: "invalid email or passowrd" },
        { status: 400 }
      );
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "invalid email or passowrd" },
        { status: 400 }
      );
    }

    const cookie = setCookie({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    });

    return NextResponse.json(
      { message: "login successfully" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
