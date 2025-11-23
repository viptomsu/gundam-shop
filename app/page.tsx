"use client";

import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { mutate: logout } = useLogout();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Auth App</h1>

      {user ? (
        <div className="space-y-4 text-center">
          <p className="text-xl">Hello, {user.username}!</p>
          <p className="text-sm text-gray-500">Role: {user.role}</p>
          <Button onClick={() => logout()}>Logout</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xl">You are not logged in.</p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
