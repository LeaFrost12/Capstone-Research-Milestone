import { auth } from "@clerk/nextjs/server";
import WalletDashboard from "@/components/wallet-dashboard";

export const instant = false;

export default async function WalletPage() { await auth.protect(); return <WalletDashboard />; }
