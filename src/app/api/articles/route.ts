/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { createArticleSchema } from "@/utils/validation/articles";
import { CreateArticleDto } from "@/utils/dtos";
import { Article } from "@prisma/client";
import { prisma } from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { verifyToken } from "@/utils/token";

/**
 ***  @desc get records by page number
 ***  @route /api/articles
 ***  @method GET
 ***  @access puplic
 **/
export async function GET(request: NextRequest) {
  try {
    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";
    const articles = await prisma.article.findMany({
      skip: (Number(pageNumber) - 1) * ARTICLE_PER_PAGE,
      take: ARTICLE_PER_PAGE,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 ***  @desc create new record
 ***  @route /api/articles
 ***  @method POST
 ***  @access private (only admin)
 **/
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }
    const body = (await request.json()) as CreateArticleDto;

    const validation = createArticleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const newRecord: Article = await prisma.article.create({
      data: {
        title: body.title,
        description: body.description,
      },
    });
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    NextResponse.json({ message: "internal server error" }, { status: 500 });
  }
}
