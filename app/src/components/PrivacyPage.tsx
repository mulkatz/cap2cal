export const PrivacyPage = () => (
  // The parent container defines the full viewport height and handles scrolling.
  <div className="h-screen overflow-y-auto bg-gray-600 p-4 sm:p-8">
    {/* The inner container now just centers and styles the card.
      The flexbox classes for managing internal scroll are removed as they are no longer needed.
    */}
    <div className="animate-fade-in mx-auto max-w-4xl rounded-lg bg-gray-800 p-8 text-left shadow-xl">
      {/* Header */}
      <div>
        <h1 className="mb-6 text-center text-4xl font-bold text-cyan-400">Privacy Policy</h1>
        <p className="mb-8 text-center text-gray-400">Last Updated: October 15, 2025</p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-gray-300">
        <section>
          <h2 className="mb-3 border-b border-gray-700 pb-2 text-2xl font-semibold text-cyan-300">1. Introduction</h2>
          <p>
            Welcome to our website. We take the protection of your personal data very seriously. This privacy policy
            informs you about the nature, scope, and purpose of the collection and use of personal data on this website
            by Franz Benthin (hereinafter "we" or "us").
          </p>
        </section>

        <section>
          <h2 className="mb-3 border-b border-gray-700 pb-2 text-2xl font-semibold text-cyan-300">
            2. Data Controller
          </h2>
          <p>
            The responsible party (controller) for data processing on this website within the meaning of the General
            Data Protection Regulation (GDPR) is:
          </p>
          <div className="mt-3 rounded-lg border-l-4 border-cyan-400 bg-gray-900/50 p-4">
            <p className="font-semibold">Franz Benthin</p>
            <p>Dorfstr. 32</p>
            <p>17291 Nordwestuckermark</p>
            <p>Germany</p>
            <p>Email: hi@franz.cx</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 border-b border-gray-700 pb-2 text-2xl font-semibold text-cyan-300">
            3. Hosting and Server Log Files
          </h2>
          <p>
            Our website is hosted by Google Firebase Hosting. The provider is Google Ireland Limited, Gordon House,
            Barrow Street, Dublin 4, Ireland. When you visit our website, Firebase Hosting automatically collects and
            stores information in so-called server log files, which your browser transmits automatically. These are:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
            <li>Browser type and browser version</li>
            <li>Operating system used</li>
            <li>Referrer URL</li>
            <li>Hostname of the accessing computer</li>
            <li>Time of the server request</li>
            <li>IP address</li>
          </ul>
          <p className="mt-3">
            This data is not merged with other data sources. The basis for this data processing is Art. 6(1)(f) GDPR, as
            we have a legitimate interest in the technically error-free presentation and security of our website.
          </p>
        </section>

        {/* ... The rest of your sections remain the same ... */}

        <section>
          <h2 className="mb-3 border-b border-gray-700 pb-2 text-2xl font-semibold text-cyan-300">
            6. Your Rights as a Data Subject
          </h2>
          <p>According to the GDPR, you have the following rights:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
            <li>Right of access (Art. 15 GDPR)</li>
            <li>Right to rectification (Art. 16 GDPR)</li>
            <li>Right to erasure ("right to be forgotten") (Art. 17 GDPR)</li>
            <li>Right to restriction of processing (Art. 18 GDPR)</li>
            <li>Right to data portability (Art. 20 GDPR)</li>
            <li>Right to object (Art. 21 GDPR)</li>
          </ul>
          <p className="mt-3">To exercise these rights, please contact us using the details provided in section 2.</p>
        </section>

        <section>
          <h2 className="mb-3 border-b border-gray-700 pb-2 text-2xl font-semibold text-cyan-300">
            7. Changes to Our Privacy Policy
          </h2>
          <p>
            We reserve the right to amend this privacy policy to ensure it always complies with current legal
            requirements or to implement changes to our services in the privacy policy, e.g., when introducing new
            services. The new privacy policy will be valid for your next visit.
          </p>
        </section>
      </div>
    </div>
  </div>
);
