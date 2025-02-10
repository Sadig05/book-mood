function Terms() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800">Terms and Conditions</h1>
      <div className="mt-4 space-y-4 text-gray-600">
        <p>
          Welcome to our application. By accessing or using our services, you
          agree to comply with the following terms and conditions.
        </p>
        <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
        <p>
          By using this site, you agree to be bound by these Terms and
          Conditions. If you do not agree, please refrain from using our
          services.
        </p>
        <h2 className="text-lg font-semibold">2. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Please check
          back periodically for updates.
        </p>
        <h2 className="text-lg font-semibold">3. User Responsibilities</h2>
        <p>
          Users must ensure their activities on the platform comply with all
          applicable laws and regulations.
        </p>
        <h2 className="text-lg font-semibold">4. Termination</h2>
        <p>
          We reserve the right to terminate access to our services at any time
          without prior notice.
        </p>
        <h2 className="text-lg font-semibold">Contact Us</h2>
        <p>
          If you have any questions, feel free to{" "}
          <a
            href="/contact"
            className="text-blue-600 underline hover:text-blue-800"
          >
            contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default Terms;
