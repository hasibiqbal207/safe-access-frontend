"use client";
import React from "react";
import Link from "next/link";
import { Shield, Lock } from "lucide-react";

const Home = () => {
  return (
    <div>
      <div className="flex max-w-3xl flex-col gap-2 mx-auto w-full md:max-w-5xl px-6 py-8">
        <h1 className="text-[28px] leading-[34px] tracking-[-0.416px] text-[#000509e3] dark:text-inherit font-extrabold">
          Welcome to Safe Access
        </h1>
        <p className="text-sm text-[#0007149f] dark:text-gray-100 font-normal">
          Manage your account security and active sessions from one place.
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 md:max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MFA Card */}
          <Link href="/mfa" className="group">
            <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5 transition-all hover:shadow-lg">
              <div className="rounded-[10px] bg-white dark:bg-background p-6 h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-12 mb-2 group-hover:text-primary transition-colors">
                      Multi-Factor Authentication
                    </h3>
                    <p className="text-sm text-[#0007149f] dark:text-gray-400">
                      Add an extra layer of security to your account by enabling MFA.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Sessions Card */}
          <Link href="/sessions" className="group">
            <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5 transition-all hover:shadow-lg">
              <div className="rounded-[10px] bg-white dark:bg-background p-6 h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-12 mb-2 group-hover:text-primary transition-colors">
                      Active Sessions
                    </h3>
                    <p className="text-sm text-[#0007149f] dark:text-gray-400">
                      View and manage all active sessions across your devices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
