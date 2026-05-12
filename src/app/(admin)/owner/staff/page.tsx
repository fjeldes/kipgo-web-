'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function OwnerStaffPage() {
  const { token } = useAuth();
  const router = useRouter();

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold mb-2" style={{ color: '#000666' }}>Staff</h1>
      <p className="text-sm mb-8" style={{ color: '#454652' }}>Manage your team members</p>

      <div className="rounded-2xl p-12 text-center bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.04)]" style={{ color: '#454652' }}>
        Staff management is available in the mobile app.
      </div>
    </div>
  );
}
