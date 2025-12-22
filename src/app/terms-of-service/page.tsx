import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-primary hover:underline mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last Updated: December 22, 2025
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            By accessing and using SafeAccess ("the Service"), you accept and
                            agree to be bound by the terms and provision of this agreement.
                            If you do not agree to abide by the above, please do not use this
                            service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            2. Use License
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            Permission is granted to temporarily access SafeAccess for
                            personal, non-commercial transitory viewing only. This is the
                            grant of a license, not a transfer of title, and under this
                            license you may not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Modify or copy the materials</li>
                            <li>
                                Use the materials for any commercial purpose or for any public
                                display
                            </li>
                            <li>
                                Attempt to reverse engineer any software contained in SafeAccess
                            </li>
                            <li>
                                Remove any copyright or other proprietary notations from the
                                materials
                            </li>
                            <li>
                                Transfer the materials to another person or "mirror" the
                                materials on any other server
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            3. User Accounts
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            When you create an account with us, you must provide accurate,
                            complete, and current information. Failure to do so constitutes a
                            breach of the Terms, which may result in immediate termination of
                            your account.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            You are responsible for safeguarding the password and for all
                            activities that occur under your account. You agree not to
                            disclose your password to any third party and to notify us
                            immediately upon becoming aware of any breach of security or
                            unauthorized use of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            4. Privacy and Data Protection
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Your use of SafeAccess is also governed by our Privacy Policy.
                            Please review our{" "}
                            <Link href="/privacy-policy" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                            , which also governs the Service and informs users of our data
                            collection practices. We take your privacy seriously and implement
                            industry-standard security measures to protect your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            5. Two-Factor Authentication (2FA)
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            SafeAccess offers two-factor authentication to enhance account
                            security. While we strongly recommend enabling 2FA, you acknowledge
                            that you are responsible for maintaining access to your
                            authentication methods. Loss of access to your 2FA device may
                            result in account recovery procedures.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            6. Prohibited Activities
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            You agree not to engage in any of the following prohibited
                            activities:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>
                                Copying, distributing, or disclosing any part of the Service in
                                any medium
                            </li>
                            <li>
                                Using any automated system to access the Service in a manner
                                that sends more request messages than a human can reasonably
                                produce
                            </li>
                            <li>
                                Transmitting spam, chain letters, or other unsolicited email
                            </li>
                            <li>
                                Attempting to interfere with, compromise the system integrity or
                                security
                            </li>
                            <li>
                                Collecting or tracking the personal information of others
                            </li>
                            <li>Impersonating another person or entity</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            7. Service Availability
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We strive to maintain high availability of SafeAccess, but we do
                            not guarantee that the Service will be available at all times. We
                            reserve the right to modify, suspend, or discontinue the Service
                            (or any part thereof) at any time with or without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            8. Limitation of Liability
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            In no event shall SafeAccess or its suppliers be liable for any
                            damages (including, without limitation, damages for loss of data
                            or profit, or due to business interruption) arising out of the use
                            or inability to use SafeAccess, even if SafeAccess or a SafeAccess
                            authorized representative has been notified orally or in writing of
                            the possibility of such damage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            9. Account Termination
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We may terminate or suspend your account immediately, without prior
                            notice or liability, for any reason whatsoever, including without
                            limitation if you breach the Terms. Upon termination, your right to
                            use the Service will immediately cease. You may also delete your
                            account at any time through the account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            10. Changes to Terms
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We reserve the right to modify or replace these Terms at any time.
                            If a revision is material, we will try to provide at least 30 days'
                            notice prior to any new terms taking effect. What constitutes a
                            material change will be determined at our sole discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            11. Governing Law
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            These Terms shall be governed and construed in accordance with the
                            laws of your jurisdiction, without regard to its conflict of law
                            provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            12. Contact Information
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            If you have any questions about these Terms, please contact us at{" "}
                            <a
                                href="mailto:support@safeaccess.com"
                                className="text-primary hover:underline"
                            >
                                support@safeaccess.com
                            </a>
                            .
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
