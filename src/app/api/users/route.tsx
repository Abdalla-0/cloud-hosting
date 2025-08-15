/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/utils/db";
import { verifyToken } from "@/utils/token";
import { NextRequest, NextResponse } from "next/server";
/**
 ***  @desc delet all users
 ***  @route /api/users
 ***  @method DELETE
 ***  @access private (only admin can delete all users)
 **/

export async function DELETE(request: NextRequest) {
  try {
    const userFromToken = verifyToken(request);
    if (userFromToken !== null && userFromToken.isAdmin) {
      await prisma.user.deleteMany({});
      return NextResponse.json(
        { message: "all users has been deleted successfully" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "you are not allowed to delete users" },
      { status: 403 } // forbidden
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
