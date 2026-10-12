import Link from "next/link";

export default function Home() {
  return <main className="min-h-screen bg-[#f7f7fb] text-slate-800"><div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12 sm:px-8"><p className="text-sm font-semibold uppercase tracking-wide text-[#2C3166]">Credit Card Wallet Manager</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#2C3166]">Keep your credit cards in one place.</h1><p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">Sign in to view your wallet and manage the cards saved to your account.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="rounded-md bg-[#2C3166] px-5 py-3 font-medium text-white hover:bg-[#20244e]" href="/sign-in">Sign in</Link><Link className="rounded-md border border-[#2C3166] px-5 py-3 font-medium text-[#2C3166] hover:bg-[#ececf5]" href="/sign-up">Create an account</Link></div></div></main>;
}
