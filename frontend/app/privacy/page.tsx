import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Hubble Privacy Policy — what data we collect, how we use it, and how long we keep it.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2
        className="font-semibold mb-3 pb-2"
        style={{
          fontSize: "20px",
          color: "var(--color-text-primary)",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: "15px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  const lastUpdated = "May 31, 2025";

  return (
    <div className="content-width py-12 md:py-16">
      <div className="max-w-2xl">
        <h1
          className="font-bold mb-2"
          style={{ fontSize: "32px", color: "var(--color-text-primary)" }}
        >
          Privacy Policy
        </h1>
        <p className="mb-10 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Last updated: {lastUpdated}
        </p>

        <Section title="Overview">
          <p>
            Hubble is designed with privacy as a default. This policy explains what data
            we collect, how we use it, and your rights. The short version: we collect as little
            as possible and never sell your data.
          </p>
        </Section>

        <Section title="Data We Collect">
          <p className="mb-3">
            <strong style={{ color: "var(--color-text-primary)" }}>API Keys:</strong> When you
            use an agent that requires an API key (Groq, Tavily, GitHub), your key is sent
            directly to our backend to make the API call. It is{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>never stored</strong> in any
            database, log file, or third-party service. It exists in memory only for the duration
            of the request.
          </p>
          <p className="mb-3">
            <strong style={{ color: "var(--color-text-primary)" }}>Agent Inputs:</strong> The
            URLs, text, or files you submit to agents are processed to complete your request.
            They are{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>not logged or stored</strong>{" "}
            beyond the immediate processing needs.
          </p>
          <p>
            <strong style={{ color: "var(--color-text-primary)" }}>Usage Analytics:</strong> We
            may collect anonymized usage statistics (which agents are used most, error rates)
            to improve the platform. No personal information or content is included.
          </p>
        </Section>

        <Section title="Data We Do NOT Collect">
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>We do not collect your name, email, or contact information (unless you create an account)</li>
            <li>We do not store API keys you provide</li>
            <li>We do not store the content of your agent inputs or results</li>
            <li>We do not sell data to third parties</li>
            <li>We do not use tracking cookies for advertising</li>
          </ul>
        </Section>

        <Section title="Cookies">
          <p>
            Hubble uses only essential cookies: a session cookie for authentication if you create
            an account, and a theme preference cookie. These are not tracking cookies and do not
            require cookie consent under GDPR. We do not use third-party advertising or analytics
            cookies.
          </p>
        </Section>

        <Section title="Data Retention">
          <p>
            Since we do not store inputs or results, there is nothing to delete. If you create
            an account, your account data is retained until you delete it. Job results (if any)
            are purged after 7 days.
          </p>
        </Section>

        <Section title="Your Rights (GDPR)">
          <p className="mb-2">If you are in the EU/EEA, you have the right to:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and all associated data</li>
            <li>Object to processing</li>
            <li>Data portability</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us via GitHub Issues or submit a request through
            the platform.
          </p>
        </Section>

        <Section title="Third-Party Services">
          <p>
            When you use an agent that calls a third-party API (Groq, Tavily, GitHub), your
            input is sent to that service. Please review their respective privacy policies.
            We are not responsible for third-party data practices.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            For privacy-related questions, open an issue on our{" "}
            <a
              href="https://github.com/RAJTripathi3030/Custom-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--color-primary)" }}
            >
              GitHub repository
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}
