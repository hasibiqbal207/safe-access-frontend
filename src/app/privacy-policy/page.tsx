import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last Updated: December 22, 2025
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            1. Introduction
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            SafeAccess ("we", "our", or "us") is committed to protecting your
                            privacy. This Privacy Policy explains how we collect, use,
                            disclose, and safeguard your information when you use our service.
                            Please read this privacy policy carefully. If you do not agree with
                            the terms of this privacy policy, please do not access the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            2. Information We Collect
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We collect information that you provide directly to us when you:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
                            <li>Create an account</li>
                            <li>Update your profile information</li>
                            <li>Use our services</li>
                            <li>Contact us for support</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            The types of information we may collect include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>
                                <strong>Personal Information:</strong> Name, email address, and
                                password (encrypted)
                            </li>
                            <li>
                                <strong>Account Information:</strong> Username, profile settings,
                                and preferences
                            </li>
                            <li>
                                <strong>Security Information:</strong> Two-factor authentication
                                settings, backup codes (encrypted), and login history
                            </li>
                            <li>
                                <strong>Technical Information:</strong> IP address, browser type,
                                device information, and session data
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            3. How We Use Your Information
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Create and manage your account</li>
                            <li>
                                Send you technical notices, updates, security alerts, and support
                                messages
                            </li>
                            <li>Respond to your comments, questions, and requests</li>
                            <li>
                                Monitor and analyze trends, usage, and activities in connection
                                with our services
                            </li>
                            <li>Detect, prevent, and address technical issues and security threats</li>
                            <li>Verify your identity and authenticate your account</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            4. Data Security
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We implement industry-standard security measures to protect your
                            personal information, including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>
                                <strong>Encryption:</strong> All passwords are hashed using bcrypt
                                with salt rounds
                            </li>
                            <li>
                                <strong>Secure Transmission:</strong> Data is transmitted over
                                HTTPS/TLS
                            </li>
                            <li>
                                <strong>Two-Factor Authentication:</strong> Optional 2FA using
                                TOTP (Time-based One-Time Password)
                            </li>
                            <li>
                                <strong>Session Management:</strong> Secure token-based
                                authentication with refresh tokens
                            </li>
                            <li>
                                <strong>Access Controls:</strong> Limited access to personal data
                                on a need-to-know basis
                            </li>
                            <li>
                                <strong>Audit Logging:</strong> Comprehensive logging of security
                                events
                            </li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            However, no method of transmission over the Internet or electronic
                            storage is 100% secure. While we strive to use commercially
                            acceptable means to protect your personal information, we cannot
                            guarantee its absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            5. Data Retention
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We retain your personal information for as long as necessary to
                            fulfill the purposes outlined in this Privacy Policy, unless a
                            longer retention period is required or permitted by law. When you
                            delete your account, we will delete or anonymize your personal
                            information within 30 days, except where we are required to retain
                            it for legal or regulatory purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            6. Information Sharing and Disclosure
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            We do not sell, trade, or rent your personal information to third
                            parties. We may share your information only in the following
                            circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>
                                <strong>With Your Consent:</strong> When you explicitly agree to
                                share your information
                            </li>
                            <li>
                                <strong>Service Providers:</strong> With third-party vendors who
                                perform services on our behalf (e.g., email delivery, hosting)
                            </li>
                            <li>
                                <strong>Legal Requirements:</strong> When required by law,
                                subpoena, or other legal process
                            </li>
                            <li>
                                <strong>Protection of Rights:</strong> To protect our rights,
                                privacy, safety, or property
                            </li>
                            <li>
                                <strong>Business Transfers:</strong> In connection with a merger,
                                acquisition, or sale of assets
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            7. Cookies and Tracking Technologies
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We use cookies and similar tracking technologies to track activity
                            on our service and store certain information. Cookies are files
                            with a small amount of data which may include an anonymous unique
                            identifier. We use cookies for authentication, session management,
                            and to remember your preferences. You can instruct your browser to
                            refuse all cookies or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            8. Your Privacy Rights
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            You have the following rights regarding your personal information:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                            <li>
                                <strong>Access:</strong> Request a copy of the personal
                                information we hold about you
                            </li>
                            <li>
                                <strong>Correction:</strong> Request correction of inaccurate or
                                incomplete information
                            </li>
                            <li>
                                <strong>Deletion:</strong> Request deletion of your account and
                                personal information
                            </li>
                            <li>
                                <strong>Data Portability:</strong> Request a copy of your data in
                                a structured, machine-readable format
                            </li>
                            <li>
                                <strong>Withdraw Consent:</strong> Withdraw consent for data
                                processing where consent is the legal basis
                            </li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                            To exercise these rights, please contact us at{" "}
                            <a
                                href="mailto:privacy@safeaccess.com"
                                className="text-primary hover:underline"
                            >
                                privacy@safeaccess.com
                            </a>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            9. Children's Privacy
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Our service is not intended for children under the age of 13. We do
                            not knowingly collect personal information from children under 13.
                            If you are a parent or guardian and believe that your child has
                            provided us with personal information, please contact us so we can
                            delete such information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            10. International Data Transfers
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Your information may be transferred to and maintained on computers
                            located outside of your state, province, country, or other
                            governmental jurisdiction where data protection laws may differ. We
                            will take all steps reasonably necessary to ensure that your data
                            is treated securely and in accordance with this Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            11. Changes to This Privacy Policy
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            We may update our Privacy Policy from time to time. We will notify
                            you of any changes by posting the new Privacy Policy on this page
                            and updating the "Last Updated" date. You are advised to review
                            this Privacy Policy periodically for any changes. Changes to this
                            Privacy Policy are effective when they are posted on this page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            12. Contact Us
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact
                            us:
                        </p>
                        <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                            <li>
                                <strong>Email:</strong>{" "}
                                <a
                                    href="mailto:privacy@safeaccess.com"
                                    className="text-primary hover:underline"
                                >
                                    privacy@safeaccess.com
                                </a>
                            </li>
                            <li>
                                <strong>Support:</strong>{" "}
                                <a
                                    href="mailto:support@safeaccess.com"
                                    className="text-primary hover:underline"
                                >
                                    support@safeaccess.com
                                </a>
                            </li>
                        </ul>
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
