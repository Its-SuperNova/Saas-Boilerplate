"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setIsSuccess(false);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // First, create the user in Supabase
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (supabaseError) {
        console.error("Supabase signup error:", supabaseError);
        setError(supabaseError.message);
        return;
      }

      if (!data.user) {
        console.error("No user data returned from Supabase");
        setError("Failed to create user");
        return;
      }

      console.log("Supabase user created:", {
        id: data.user.id,
        email: data.user.email,
      });

      // Then, create the user in our database
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authId: data.user.id,
          email: data.user.email,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Database user creation error:", responseData);
        throw new Error(
          responseData.message || responseData.error || "Failed to create user"
        );
      }

      console.log("Database user created:", responseData.user);

      // Show success message
      setIsSuccess(true);
      setIsLoading(false);

      // Wait for 2 seconds to show the success message
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Sign up to get started with our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Account created successfully! Redirecting to login...
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isSuccess}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isSuccess}
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Account Created!
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
