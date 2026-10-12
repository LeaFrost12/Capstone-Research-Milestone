import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export const instant = false;

export default function SignInPage() { return <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb] p-5"><Suspense><SignIn /></Suspense></main>; }
