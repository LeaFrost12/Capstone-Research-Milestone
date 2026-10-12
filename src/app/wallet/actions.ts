"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export type CardActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success: boolean;
};

const rewardTypes = new Set(["Cash back", "Travel points", "Miles", "Store rewards", "Other"]);

export async function createCard(formData: FormData): Promise<CardActionResult> {
  const { userId } = await auth.protect();
  const cardData = validateCard(formData);

  if ("fieldErrors" in cardData) {
    return { fieldErrors: cardData.fieldErrors, success: false };
  }

  try {
    await prisma.card.create({
      data: { ...cardData, userId },
    });
  } catch {
    return { error: "Your card could not be saved. Please try again.", success: false };
  }

  revalidatePath("/wallet");
  return { success: true };
}

export async function updateCard(cardId: string, formData: FormData): Promise<CardActionResult> {
  const { userId } = await auth.protect();
  const cardData = validateCard(formData);

  if ("fieldErrors" in cardData) {
    return { fieldErrors: cardData.fieldErrors, success: false };
  }

  try {
    const result = await prisma.card.updateMany({
      data: cardData,
      where: { id: cardId, userId },
    });

    if (result.count === 0) {
      return { error: "This card was not found in your wallet.", success: false };
    }
  } catch {
    return { error: "Your card could not be updated. Please try again.", success: false };
  }

  revalidatePath("/wallet");
  return { success: true };
}

function validateCard(formData: FormData):
  | { annualFee: string; issuer: string; name: string; notes: string | null; rewardType: string }
  | { fieldErrors: Record<string, string> } {
  const name = String(formData.get("name") ?? "").trim();
  const issuer = String(formData.get("issuer") ?? "").trim();
  const annualFeeInput = String(formData.get("annualFee") ?? "").trim();
  const annualFee = Number(annualFeeInput);
  const rewardType = String(formData.get("rewardType") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  const fieldErrors: Record<string, string> = {};

  if (!name) fieldErrors.name = "Please enter a card name.";
  if (!issuer) fieldErrors.issuer = "Please enter an issuer.";
  if (!annualFeeInput || !Number.isFinite(annualFee) || annualFee < 0) {
    fieldErrors.annualFee = "Enter $0 or a positive amount.";
  }
  if (!rewardTypes.has(rewardType)) {
    fieldErrors.rewardType = "Please select a reward type.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  return { annualFee: annualFee.toFixed(2), issuer, name, notes: notes || null, rewardType };
}

export async function deleteCard(cardId: string): Promise<CardActionResult> {
  const { userId } = await auth.protect();

  try {
    const result = await prisma.card.deleteMany({
      where: { id: cardId, userId },
    });

    if (result.count === 0) {
      return { error: "This card was not found in your wallet.", success: false };
    }
  } catch {
    return { error: "Your card could not be deleted. Please try again.", success: false };
  }

  revalidatePath("/wallet");
  return { success: true };
}
