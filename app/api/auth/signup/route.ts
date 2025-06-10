import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// This ensures the route is not cached and always runs on the server
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { authId, email } = await request.json();

    if (!authId || !email) {
      console.error("Missing required fields:", { authId, email });
      return NextResponse.json(
        { error: "Missing required fields: authId and email are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ authId }, { email }],
      },
    });

    if (existingUser) {
      console.error("User already exists:", { authId, email });
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        authId,
        email,
        role: "USER",
      },
    });

    console.log("Successfully created user:", {
      id: user.id,
      email: user.email,
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    // Log the full error for debugging
    console.error("Error creating user:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return a more specific error message
    return NextResponse.json(
      {
        error: "Failed to create user",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
