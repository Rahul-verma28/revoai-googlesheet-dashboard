import { useRouter } from "next/navigation";
import type React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Link from "next/link";
interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login");
        toast("Logged out successfully");
      } else {
        console.error("Failed to logout");
        toast("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className=" flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-lg font-semibold">
              DataSync
            </Link>
          </div>
          <nav className="flex items-center">
            <Button onClick={handleLogout} className="text-sm font-medium">
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 space-y-4 pt-6">
        <div className="flex-1 space-y-4">{children}</div>
      </main>
    </div>
  );
}
