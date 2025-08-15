/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/token";
import { CreateCommentDto } from "@/utils/dtos";
import { createCommentSchema } from "@/utils/validation/comments";

/**
 ***  @desc create new comment
 ***  @route /api/comments
 ***  @method POST
 ***  @access private (only logeed in user)
 **/
export async function POST(request: NextRequest) {
  try {
    // check if user has token
    const userFromToken = verifyToken(request);

    if (!userFromToken || userFromToken === null) {
      return NextResponse.json(
        { message: "only logged in user, access denied" },
        { status: 401 } // unauthorized
      );
    }

    // extract request body (user comment) from reqest
    const reqBody = (await request.json()) as CreateCommentDto;

    // make validation on user comment
    const validation = createCommentSchema.safeParse(reqBody);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // check if article exist
    const article = await prisma.article.findUnique({
      where: { id: reqBody.articleId },
    });
    if (!article) {
      return NextResponse.json(
        { message: "article not found" },
        { status: 404 }
      );
    }

    // create new comment
    const newComment = await prisma.comment.create({
      data: {
        text: reqBody.text,
        articleId: reqBody.articleId,
        userId: userFromToken.id,
      },
    });

    // give comment to user
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 ***  @desc get all comments
 ***  @route /api/comments
 ***  @method GET
 ***  @access private (only admin)
 **/
export async function GET(request: NextRequest) {
  try {
    // check if user has token and and admin
    const userFromToken = verifyToken(request);
    if (!userFromToken || !userFromToken.isAdmin) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 } // unauthorized
      );
    }

    // get all comments
    const comments = await prisma.comment.findMany();

    // give comment to user
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}


