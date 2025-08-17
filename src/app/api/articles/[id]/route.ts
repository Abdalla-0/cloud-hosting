/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/utils/db";
import { UpdateAtricleDto } from "@/utils/dtos";
import { verifyToken } from "@/utils/token";
import { updateArticleSchema } from "@/utils/validation/articles";
import { NextRequest, NextResponse } from "next/server";
interface Props {
  params: Promise<{ id: string }>;
}
/**
 ***  @desc get single article by id
 ***  @route /api/articles/:id
 ***  @method GET
 ***  @access public
 **/
export async function GET(request: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
      include: {
        comments: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "interval server error" },
      { status: 500 }
    );
  }
}

/**
 ***  @desc update single article by id
 ***  @route /api/articles/:id
 ***  @method PUT
 ***  @access private (only admin)
 **/
export async function PUT(request: NextRequest, props: Props) {
  try {
    const user = verifyToken(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }
    const { id } = await props.params;
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as UpdateAtricleDto;

    const validation = updateArticleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "interval server error" },
      { status: 500 }
    );
  }
}

/**
 ***  @desc delete single article by id
 ***  @route /api/articles/:id
 ***  @method DELETE
 ***  @access private (only admin)
 **/
export async function DELETE(request: NextRequest, props: Props) {
  try {
    const user = verifyToken(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }
    const { id } = await props.params;
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
      include: { comments: true },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }
    // delete the article
    await prisma.article.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "interval server error" },
      { status: 500 }
    );
  }
}
