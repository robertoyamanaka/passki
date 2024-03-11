"use client";
import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import SignInPassKey from "@/features/authenticate/components/signInPassKey";

export default function SignInPage() {
  const [newScreen, setNewScreen] = useState(false);
  
  return (
    <>
      {newScreen ? (
        <SignInPassKey />
      ) : (
        <div className="h-screen flex flex-col items-center justify-center">
          <SignIn />
          <button
            onClick={() => setNewScreen(true)}
            type="button"
            className="mt-3 rounded-md bg-blue-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Log in with my fingerprint ✨
          </button>
        </div>
      )}
    </>
  );
}
