"use client";
import { useCallback } from "react";
import { createRegistrationOptions } from "@/features/register/create-registration-options";
import { startRegistration } from "@simplewebauthn/browser";
import { endRegistration } from "@/features/register/end-registration";
import { SignOutButton } from "@clerk/nextjs";

export default function RegisterPassKey() {
  const onClick = useCallback(async () => {
    const registrationOptions = await createRegistrationOptions();
    console.log("registrationOptions", registrationOptions);
    try {
      const registrationResponse = await startRegistration(registrationOptions);
      console.log("registrationResponse", registrationResponse);
      const registrationStatus = await endRegistration(registrationResponse);
      console.log("Registration successful", registrationStatus);
    } catch (error: unknown) {
      alert("Error: Authenticator was probably already registered by user");
      console.error("Error starting registration:", error);
      return;
    }
  }, []);

  return (
    <div className="relative isolate flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-900">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-4xl">
            Setup your own Passkey
            <br />
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-2xl leading-8 text-gray-300">
            You can use your fingerprint or FaceId to login to your account
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={onClick}
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Lets do it!
            </button>
            <SignOutButton />

          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        aria-hidden="true"
      >
        <circle
          cx={512}
          cy={512}
          r={512}
          fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
          fillOpacity="0.7"
        />
        <defs>
          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
            <stop stopColor="#7775D6" />
            <stop offset={1} stopColor="#E935C1" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
