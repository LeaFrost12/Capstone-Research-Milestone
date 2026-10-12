import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export const instant = false;

export default function SignUpPage() { return <main className="flex min-h-screen items-center justify-center bg-[#f7f7fb] p-5"><Suspense><SignUp /></Suspense></main>; }
