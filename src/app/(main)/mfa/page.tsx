"use client";
import React from "react";
import EnableMfa from "../components/EnableMfa";

const MfaPage = () => {
    return (
        <div>
            <div className="flex max-w-3xl flex-col gap-2 mx-auto w-full md:max-w-5xl px-6 py-8">
                <h1 className="text-[28px] leading-[34px] tracking-[-0.416px] text-[#000509e3] dark:text-inherit font-extrabold">
                    Multi-Factor Authentication
                </h1>
                <p className="text-sm text-[#0007149f] dark:text-gray-100 font-normal">
                    Enhance your account security by enabling multi-factor authentication.
                </p>
            </div>
            <div className="max-w-3xl mx-auto w-full px-6 md:max-w-5xl">
                <EnableMfa />
            </div>
        </div>
    );
};

export default MfaPage;
