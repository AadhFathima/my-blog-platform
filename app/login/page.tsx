"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <button
        onClick={() => signIn("google")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Sign in with Google
      </button>
      <button
        onClick={() => signIn("github")}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}