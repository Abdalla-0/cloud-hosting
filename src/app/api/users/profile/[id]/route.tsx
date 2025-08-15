/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/token";
import { UpdateUserDto } from "@/utils/dtos";
import { hashPassword } from "@/utils/crypto";
import { updateUserSchema } from "@/utils/validation/auth";

interface Props {
  params: Promise<{ id: string }>;
}
/**
 ***  @desc delet user by id
 ***  @route /api/users/profile/:id
 ***  @method DELETE
 ***  @access private (only user himself can delete his account)
 **/
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { comments: true },
    });

    if (!user || user.id !== Number(id)) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const userFromToken = verifyToken(request);
    if (userFromToken !== null && userFromToken.id === user.id) {
      const commentIds = user?.comments.map((comment) => comment.id);
      await prisma.comment.deleteMany({
        where: { id: { in: commentIds } },
      });
      await prisma.user.delete({
        where: { id: Number(id) },
      });

      return NextResponse.json(
        { message: "your profile has been deleted successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "you are not allowed, access denied" },
      { status: 403 } // forbidden
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 ***  @desc get user by id
 ***  @route /api/users/profile/:id
 ***  @method GET
 ***  @access public (get user account)
 **/
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!user || user.id !== Number(id)) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const userFromToken = verifyToken(request);

    if (userFromToken !== null && userFromToken.id === user.id) {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          username: true,
          isAdmin: true,
          createdAt: true,
        },
      });

      return NextResponse.json(user, { status: 200 });
    }
    return NextResponse.json(
      { message: "you are not allowed, access denied" },
      { status: 403 } // forbidden
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 ***  @desc update user by id
 ***  @route /api/users/profile/:id
 ***  @method PUT
 ***  @access public (update user account)
 **/
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!user || user.id !== Number(id)) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const userFromToken = verifyToken(request);

    if (userFromToken !== null && userFromToken.id === user.id) {

      const reqBody = (await request.json()) as UpdateUserDto;

      const validation = updateUserSchema.safeParse(reqBody);
      
      if (!validation.success) {
        return NextResponse.json(
          {
            message: validation.error.issues[0].message,
          },
          { status: 400 }
        );
      }
      if (reqBody.password) {
        reqBody.password = await hashPassword(reqBody.password);
      }
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          email: reqBody.email,
          username: reqBody.username,
          password: reqBody.password,
        },
      });
      const { password, ...others } = updatedUser;
      return NextResponse.json(others, { status: 200 });
    }
    return NextResponse.json(
      { message: "you are not allowed, access denied" },
      { status: 403 } // forbidden
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
