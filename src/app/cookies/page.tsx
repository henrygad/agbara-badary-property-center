export default function CookiePolicy() {
    return <div className='text-sm'>
        {/* Hero */}
        <section className="py-6">
            <div className="mx-auto text-center">
                <h3 className="text-2xl font-semibold">
                    Cookie Policy
                </h3>
            </div>
        </section>
        <section className='p-3 mb-20'>
            <p className="mb-4">
                This Cookie Policy explains how <strong>Agbara Badagry Property Center</strong>
                (“we”, “our”, or “us”) uses cookies and similar technologies on
                our website <a href="agbarabadagrypropertycenter.com" className="font-bold text-primary" >agbarabadagrypropertycenter.com</a>.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">1. What Are Cookies?</h3>
            <p className="mb-4">
                Cookies are small text files stored on your device when you visit a website.
                They help the site remember your actions and preferences (such as login,
                search filters, or saved properties) for a smoother experience.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">2. How We Use Cookies</h3>
            <p className="mb-4">We use cookies for several important purposes:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                    <strong>Essential Cookies:</strong> Allow you to access secure areas,
                    like your dashboard or saved properties.
                </li>
                <li>
                    <strong>Functional Cookies:</strong> Remember your preferences,
                    such as language or location filters.
                </li>
                <li>
                    <strong>Analytics Cookies:</strong> Help us understand how visitors use
                    our website so we can improve user experience.
                </li>
                <li>
                    <strong>Security Cookies:</strong> Used to detect and prevent fraud
                    or unauthorized access to your account.
                </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3. Cookies We Set</h3>
            <p className="mb-4">
                Below are some examples of cookies that may be stored by our website:
            </p>
            <table className="w-full text-sm border border-gray-200 mb-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-3 py-2 text-left">Cookie Name</th>
                        <th className="border px-3 py-2 text-left">Purpose</th>
                        <th className="border px-3 py-2 text-left">Duration</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-3 py-2">user_session</td>
                        <td className="border px-3 py-2">Used to identify logged-in users securely</td>
                        <td className="border px-3 py-2">30 days</td>
                    </tr>
                    <tr>
                        <td className="border px-3 py-2">cookieNoticeSeen</td>
                        <td className="border px-3 py-2">Prevents showing the cookie banner again</td>
                        <td className="border px-3 py-2">1 year</td>
                    </tr>
                    <tr>
                        <td className="border px-3 py-2">property_request_track</td>
                        <td className="border px-3 py-2">Tracks property requests to prevent spam</td>
                        <td className="border px-3 py-2">7 day</td>
                    </tr>
                </tbody>
            </table>

            <h3 className="text-xl font-semibold mt-6 mb-3">
                4. Managing Your Cookies
            </h3>
            <p className="mb-4">
                Most browsers automatically accept cookies, but you can modify your settings
                to decline them if you prefer. Note that disabling cookies may affect how
                certain parts of the site function — for example, you may need to log in again.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
                5. Third-Party Cookies
            </h3>
            <p className="mb-4">
                We may use third-party tools such as Google Analytics or Mapbox for analytics
                or maps. These services may set their own cookies to improve their features.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
                6. Updates to This Policy
            </h3>
            <p className="mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our
                practices or for other operational, legal, or regulatory reasons.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
                7. Contact Us
            </h3>
            <p className="mb-8">
                If you have any questions about this Cookie Policy, please contact us at: <br />
                <a
                    href="agbarabadagrypropertycenter@gmail.com/contact"
                    className="text-red-700 font-medium hover:underline"
                >
                    agbarabadagrypropertycenter@gmail.com
                </a>
            </p>

            <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
            </p>
        </section>
    </div>
};

