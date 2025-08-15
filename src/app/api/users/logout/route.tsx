/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 ***  @desc logout user
 ***  @route /api/users/logout
 ***  @method GET
 ***  @access public
 **/
export async function GET(request: NextRequest) {
  try {
    (await cookies()).delete("token");
    return NextResponse.json({ message: "logout" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
