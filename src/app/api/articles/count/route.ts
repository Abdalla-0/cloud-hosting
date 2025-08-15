/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

/**
 ***  @desc get records by count
 ***  @route /api/articles/count
 ***  @method GET
 ***  @access public
 **/

 // get articles count (no use in this project)
export async function GET(request: NextRequest) {
  try {
    const count = await prisma.article.count();
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "interval server error" },
      { status: 500 }
    );
  }
}
