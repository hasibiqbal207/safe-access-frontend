"use client";
import React, { useState, useCallback } from "react";
import { Check, Copy, Download, Printer, AlertTriangle, Shield } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/app/components/dialog";
import { Button } from "@/app/components/button";
import { toast } from "@/hooks/use-toast";

interface BackupCodesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    backupCodes: string[];
}

const BackupCodesDialog: React.FC<BackupCodesDialogProps> = ({
    isOpen,
    onClose,
    backupCodes,
}) => {
    const [copied, setCopied] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    const handleCopyAll = useCallback(() => {
        const codesText = backupCodes.join("\n");
        navigator.clipboard.writeText(codesText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: "Copied!",
            description: "All backup codes copied to clipboard",
        });
    }, [backupCodes]);

    const handleDownload = useCallback(() => {
        const codesText = backupCodes.join("\n");
        const blob = new Blob([
            `SafeAccess MFA Backup Codes\n` +
            `Generated: ${new Date().toLocaleString()}\n` +
            `\n` +
            `IMPORTANT: Keep these codes safe and secure.\n` +
            `Each code can only be used once.\n` +
            `\n` +
            `Backup Codes:\n` +
            `${codesText}\n`
        ], { type: "text/plain" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `safeaccess-backup-codes-${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setDownloaded(true);
        toast({
            title: "Downloaded!",
            description: "Backup codes saved to your device",
        });
    }, [backupCodes]);

    const handlePrint = useCallback(() => {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SafeAccess MFA Backup Codes</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 40px;
                max-width: 600px;
                margin: 0 auto;
              }
              h1 {
                color: #1a1a1a;
                border-bottom: 2px solid #e5e5e5;
                padding-bottom: 10px;
              }
              .warning {
                background: #fff3cd;
                border: 1px solid #ffc107;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
              }
              .codes-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin: 20px 0;
              }
              .code {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                padding: 10px;
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 4px;
                text-align: center;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #666;
              }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <h1>🔐 SafeAccess MFA Backup Codes</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            
            <div class="warning">
              <strong>⚠️ IMPORTANT:</strong>
              <ul>
                <li>Keep these codes in a safe and secure location</li>
                <li>Each code can only be used once</li>
                <li>Use these codes if you lose access to your authenticator app</li>
                <li>Do not share these codes with anyone</li>
              </ul>
            </div>
            
            <h2>Your Backup Codes:</h2>
            <div class="codes-container">
              ${backupCodes.map((code, index) => `
                <div class="code">${index + 1}. ${code}</div>
              `).join('')}
            </div>
            
            <div class="footer">
              <p>SafeAccess - Secure Authentication System</p>
            </div>
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 250);
        }

        toast({
            title: "Print Dialog Opened",
            description: "Print your backup codes for safekeeping",
        });
    }, [backupCodes]);

    const handleConfirmClose = () => {
        if (!downloaded && !copied) {
            const confirmed = window.confirm(
                "Have you saved your backup codes? You won't be able to see them again!"
            );
            if (confirmed) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleConfirmClose}>
            <DialogContent className="max-w-2xl !gap-0">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-green-500" />
                        <DialogTitle className="text-xl text-slate-12 font-semibold">
                            MFA Enabled Successfully!
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-slate-11 mt-2">
                        Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
                    </DialogDescription>
                </DialogHeader>

                {/* Warning Banner */}
                <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm mb-1">
                                Important: Save These Codes Now
                            </h4>
                            <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
                                <li>• Each code can only be used once</li>
                                <li>• You won't be able to see these codes again</li>
                                <li>• Store them in a password manager or secure location</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Backup Codes Grid */}
                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-slate-12 mb-3">
                        Your Backup Codes ({backupCodes.length} codes)
                    </h3>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                        {backupCodes.map((code, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 font-mono text-sm bg-white dark:bg-slate-800 px-3 py-2 rounded border border-slate-200 dark:border-slate-700"
                            >
                                <span className="text-slate-400 dark:text-slate-500 text-xs">
                                    {String(index + 1).padStart(2, '0')}.
                                </span>
                                <span className="text-slate-900 dark:text-slate-100 font-semibold tracking-wider">
                                    {code}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={handleCopyAll}
                        variant="outline"
                        className="flex-1 h-10 gap-2"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy All
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="flex-1 h-10 gap-2"
                    >
                        <Download className="w-4 h-4" />
                        {downloaded ? "Downloaded" : "Download"}
                    </Button>

                    <Button
                        onClick={handlePrint}
                        variant="outline"
                        className="flex-1 h-10 gap-2"
                    >
                        <Printer className="w-4 h-4" />
                        Print
                    </Button>
                </div>

                {/* Confirmation Button */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <Button
                        onClick={handleConfirmClose}
                        className="w-full h-11 bg-green-600 hover:bg-green-700 text-white"
                    >
                        I've Saved My Backup Codes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BackupCodesDialog;
