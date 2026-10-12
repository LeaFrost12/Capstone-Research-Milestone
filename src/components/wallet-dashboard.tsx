"use client";

import { UserButton } from "@clerk/nextjs";
import { FormEvent, ReactNode, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCard, deleteCard } from "@/app/wallet/actions";

type WalletCard = {
  annualFee: number;
  id: string;
  issuer: string;
  name: string;
  notes: string | null;
  rewardType: string;
};

type FormErrors = Partial<Record<"name" | "issuer" | "annualFee" | "rewardType", string>>;

const rewardTypes = ["Cash back", "Travel points", "Miles", "Store rewards", "Other"];
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function WalletDashboard({ initialCards, loadError }: { initialCards: WalletCard[]; loadError?: string }) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isPending, startTransition] = useTransition();
  const totalAnnualFees = initialCards.reduce((total, card) => total + card.annualFee, 0);

  function handleCreateCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: FormErrors = {};
    const annualFee = Number(data.get("annualFee"));

    if (!String(data.get("name") ?? "").trim()) nextErrors.name = "Please enter a card name.";
    if (!String(data.get("issuer") ?? "").trim()) nextErrors.issuer = "Please enter an issuer.";
    if (!String(data.get("annualFee") ?? "").trim() || !Number.isFinite(annualFee) || annualFee < 0) nextErrors.annualFee = "Enter $0 or a positive amount.";
    if (!String(data.get("rewardType") ?? "")) nextErrors.rewardType = "Please select a reward type.";

    setFieldErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    startTransition(async () => {
      const result = await createCard(data);
      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.error ?? "Please correct the highlighted fields.");
        return;
      }

      form.reset();
      router.refresh();
    });
  }

  function handleDeleteCard(cardId: string) {
    setDeleteError("");
    startTransition(async () => {
      const result = await deleteCard(cardId);
      if (!result.success) {
        setDeleteError(result.error ?? "Your card could not be deleted.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <main className="min-h-screen bg-[#f7f7fb] text-slate-800">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-semibold text-[#2C3166]">My Credit Card Wallet</h1>
            <p className="mt-1 text-slate-600">A simple place to keep track of your cards.</p>
          </div>
          <UserButton />
        </header>

        <section aria-label="Wallet summary" className="grid gap-4 sm:grid-cols-2">
          <SummaryCard label="Cards in wallet" value={String(initialCards.length)} />
          <SummaryCard label="Total annual fees" value={currency.format(totalAnnualFees)} />
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <section aria-labelledby="wallet-heading">
            <h2 id="wallet-heading" className="mb-4 text-xl font-semibold">Your cards</h2>
            {loadError ? <ErrorMessage>{loadError}</ErrorMessage> : null}
            {deleteError ? <ErrorMessage>{deleteError}</ErrorMessage> : null}

            {!loadError && initialCards.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <h3 className="text-lg font-medium">Your wallet is empty</h3>
                <p className="mt-2 text-sm text-slate-600">Use the form to add your first card.</p>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              {initialCards.map((card) => (
                <article key={card.id} className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{card.name}</h3>
                      <p className="text-sm text-slate-600">{card.issuer}</p>
                    </div>
                    <button className="text-sm text-slate-600 underline hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} onClick={() => handleDeleteCard(card.id)} type="button">Delete</button>
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm">
                    <div><dt className="text-slate-500">Annual fee</dt><dd className="mt-1 font-medium">{currency.format(card.annualFee)}</dd></div>
                    <div><dt className="text-slate-500">Rewards</dt><dd className="mt-1 font-medium">{card.rewardType}</dd></div>
                  </dl>
                  {card.notes ? <p className="mt-4 text-sm text-slate-600">{card.notes}</p> : null}
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="add-card-heading" className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 id="add-card-heading" className="text-xl font-semibold">Add a card</h2>
            <p className="mt-1 text-sm text-slate-600">Your card will be saved to your wallet.</p>
            {formError ? <ErrorMessage>{formError}</ErrorMessage> : null}
            <form className="mt-5 space-y-4" noValidate onSubmit={handleCreateCard}>
              <Field error={fieldErrors.name} label="Card name"><input className="input" disabled={isPending} name="name" placeholder="e.g. Gold Rewards" /></Field>
              <Field error={fieldErrors.issuer} label="Issuer"><input className="input" disabled={isPending} name="issuer" placeholder="e.g. Northstar Bank" /></Field>
              <Field error={fieldErrors.annualFee} label="Annual fee"><div className="input flex items-center"><span className="mr-1 text-slate-500">$</span><input className="min-w-0 flex-1 bg-transparent outline-none" disabled={isPending} inputMode="decimal" min="0" name="annualFee" placeholder="0.00" step="0.01" type="number" /></div></Field>
              <Field error={fieldErrors.rewardType} label="Reward type"><select className="input" defaultValue="" disabled={isPending} name="rewardType"><option value="">Select a reward type</option>{rewardTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
              <Field label="Notes (optional)"><textarea className="input min-h-24 resize-y" disabled={isPending} name="notes" placeholder="Anything you want to remember about this card" /></Field>
              <button className="w-full rounded-md bg-[#2C3166] px-4 py-2.5 font-medium text-white hover:bg-[#20244e] focus:outline-none focus:ring-2 focus:ring-[#2C3166] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">{isPending ? "Saving..." : "Add card"}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return <article className="rounded-lg border border-[#2C3166] bg-[#2C3166] p-5 text-white"><p className="text-sm text-slate-200">{label}</p><p className="mt-1 text-3xl font-semibold">{value}</p></article>;
}

function Field({ children, error, label }: { children: ReactNode; error?: string; label: string }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium">{label}</span>{children}{error ? <span className="mt-1 block text-sm text-red-700">{error}</span> : null}</label>;
}

function ErrorMessage({ children }: { children: ReactNode }) {
  return <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{children}</p>;
}
