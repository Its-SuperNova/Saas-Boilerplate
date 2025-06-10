import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// This ensures the route is not cached and always runs on the server
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { authId, email } = await request.json();

    const user = await prisma.user.create({
      data: {
        authId,
        email,
        role: "USER",
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
