"use client";
import { useCallback, useState } from "react";
import { createAuthenticationOptions } from "@/features/authenticate/create-authentication-options";
import { startAuthentication } from "@simplewebauthn/browser";
import { endAuthentication } from "@/features/authenticate/end-authentication";
import { useSignIn } from "@clerk/nextjs";

export default function SignInPassKey() {
  const { signIn, setActive } = useSignIn();
  const [username, setUsername] = useState("");

  const passkeyAuthenticate = useCallback(async () => {
    const authenticationOptions = await createAuthenticationOptions(username);
    try {
      const authenticationResponse = await startAuthentication(
        authenticationOptions,
        false
      );
      console.log("authenticationResponse", authenticationResponse);
      const signInToken = await endAuthentication(authenticationResponse);
      console.log("sign in token", signInToken);
      if (!signIn || !signInToken) return;
      const res = await signIn.create({
        strategy: "ticket",
        ticket: signInToken as string,
      });
      console.log("auth response", res);
      await setActive({
        session: res.createdSessionId,
      });
    } catch (error: unknown) {
      console.error("Error starting authentication:", error);
      return;
    }
  }, [username, setActive, signIn]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div>
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-4xl">
          Log In with your PassKey
        </h2>
        <div className="justify-self-start mt-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-white text-2xl"
          >
            Username
          </label>
          <div className="mt-2 w-full">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <button
            type="button"
            onClick={passkeyAuthenticate}
            className="mt-3 rounded-md  w-full bg-blue-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Log in with my fingerprint ✨
          </button>
        </div>
      </div>
    </div>
  );
}
