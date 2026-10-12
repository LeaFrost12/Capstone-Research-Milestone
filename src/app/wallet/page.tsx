import { auth } from "@clerk/nextjs/server";
import type { Card } from "@/generated/prisma/client";
import WalletDashboard from "@/components/wallet-dashboard";
import prisma from "@/lib/prisma";

export const instant = false;

export default async function WalletPage() {
  const { userId } = await auth.protect();
  let cards: Card[] = [];
  let loadError: string | undefined;

  try {
    cards = await prisma.card.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId },
    });
  } catch {
    loadError = "Your wallet could not be loaded. Please refresh the page and try again.";
  }

  return <WalletDashboard initialCards={cards.map((card) => ({ ...card, annualFee: Number(card.annualFee) }))} loadError={loadError} />;
}
