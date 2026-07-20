import { getServerSession } from "@/lib/session";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function AccountPage() {
  const session = await getServerSession();

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-display-sm text-charcoal mb-2">
        Welcome, {session?.profile?.displayName ?? "there"}
      </h1>
      <p className="text-charcoal/60 mb-8">{session?.profile?.email}</p>
      <SignOutButton />
    </div>
  );
}
