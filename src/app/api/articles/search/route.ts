/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/constants";

/**
 ***  @desc get records by search text
 ***  @route /api/articles/search?searchText=value
 ***  @method GET
 ***  @access public
 **/

export async function GET(request: NextRequest) {
  try {
    const searchText = request.nextUrl.searchParams.get("searchText");
    let articles;
    if (searchText) {
      articles = await prisma.article.findMany({
        where: {
          title: {
            startsWith: searchText,
            mode: "insensitive",
          },
        },
      });
    } else {
      articles = await prisma.article.findMany({ take: ARTICLE_PER_PAGE });
    }
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "interval server error" },
      { status: 500 }
    );
  }
}
