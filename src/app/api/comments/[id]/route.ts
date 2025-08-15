/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/token";
import { UpdateCommentDto } from "@/utils/dtos";
import { updateCommentSchema } from "@/utils/validation/comments";

interface Props {
  params: Promise<{ id: string }>;
}
/**
 ***  @desc update comment
 ***  @route /api/comments/:id
 ***  @method PUT
 ***  @access private (only comment owner)
 **/
export async function PUT(request: NextRequest, { params }: Props) {
  const id = (await params).id;
  try {
    console.log("Full URL:", request.url);
    // check if user has token
    const userFromToken = verifyToken(request);
    if (!userFromToken) {
      return NextResponse.json(
        { message: "only logged in user, access denied" },
        { status: 401 } // unauthorized
      );
    }

    // check if comment exist
    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });
    if (!comment) {
      return NextResponse.json(
        { message: "comment not found" },
        { status: 404 }
      );
    }

    // check if user is the owner for this comment
    if (userFromToken.id !== comment.userId) {
      return NextResponse.json(
        { message: "you are not allowed, access denied" },
        { status: 403 } // forbidden
      );
    }

    // extract request body (user comment) from reqest
    const reqBody = (await request.json()) as UpdateCommentDto;

    // make validation on user comment
    const validation = updateCommentSchema.safeParse(reqBody);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // update comment
    const updatedComment = await prisma.comment.update({
      where: {
        id: Number(id),
      },
      data: {
        text: reqBody.text,
      },
    });

    // give updated comment to user
    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 ***  @desc delet comment by id
 ***  @route /api/users/:id
 ***  @method DELETE
 ***  @access private (only owner or admin can delete comment)
 **/
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    // check if user has token
    const userFromToken = verifyToken(request);
    if (!userFromToken) {
      return NextResponse.json(
        { message: "only logged in user, access denied" },
        { status: 401 } // unauthorized
      );
    }
    // check if comment exist
    const comment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });
    if (!comment) {
      return NextResponse.json(
        { message: "comment not found" },
        { status: 404 }
      );
    }

    // check if user is the owner for this comment
    if (userFromToken.id === comment.userId || userFromToken.isAdmin) {
      // delete comment
      await prisma.comment.delete({ where: { id: comment.id } });

      // give respone to user
      return NextResponse.json(
        { message: "comment has been deleted successfully" },
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
