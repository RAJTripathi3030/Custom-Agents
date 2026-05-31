import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Hubble Terms of Service — acceptable use policy for the AI agent platform.",
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

export default function TermsPage() {
  const lastUpdated = "May 31, 2025";

  return (
    <div className="content-width py-12 md:py-16">
      <div className="max-w-2xl">
        <h1
          className="font-bold mb-2"
          style={{ fontSize: "32px", color: "var(--color-text-primary)" }}
        >
          Terms of Service
        </h1>
        <p className="mb-10 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Last updated: {lastUpdated}
        </p>

        <Section title="Acceptance of Terms">
          <p>
            By using Hubble, you agree to these terms. If you do not agree, please do not use
            the platform. These terms may be updated from time to time — continued use constitutes
            acceptance of the updated terms.
          </p>
        </Section>

        <Section title="Acceptable Use">
          <p className="mb-3">You may use Hubble to automate legitimate tasks. You agree NOT to use Hubble to:</p>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>Scrape private, personal, or proprietary data without authorization</li>
            <li>Circumvent security measures, authentication, or access controls on any system</li>
            <li>Generate malicious code, malware, exploits, or content designed to cause harm</li>
            <li>Violate the terms of service of any third-party API or service used by the agents</li>
            <li>Conduct illegal activities, including unauthorized access to computer systems</li>
            <li>Harass, threaten, or harm individuals</li>
            <li>Attempt to overwhelm or disrupt the Hubble platform (DDoS, scraping, etc.)</li>
            <li>Use the platform in ways that violate applicable laws in your jurisdiction</li>
          </ul>
        </Section>

        <Section title="Third-Party APIs">
          <p>
            Hubble integrates with third-party services (Groq, Tavily, GitHub). Your use of
            these services through Hubble is also subject to their respective terms of service
            and acceptable use policies. You are responsible for ensuring you have the right to
            use these APIs and that your usage complies with their terms.
          </p>
        </Section>

        <Section title="API Keys">
          <p>
            You are responsible for keeping your API keys secure. Do not share your keys.
            Hubble does not store your keys, but you should rotate keys immediately if you
            believe they have been compromised.
          </p>
        </Section>

        <Section title="Rate Limits and Fair Use">
          <p>
            Hubble enforces rate limits to ensure fair access for all users. Attempting to
            circumvent rate limits (e.g., via IP rotation, scripted requests) is prohibited
            and may result in an IP block.
          </p>
        </Section>

        <Section title="Disclaimer of Warranties">
          <p>
            Hubble is provided &ldquo;as is&rdquo; without warranty of any kind. We do not guarantee
            that agents will always return correct, complete, or up-to-date results. AI-generated
            output should be reviewed before use in production systems.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Hubble and its maintainers are not liable
            for any indirect, incidental, or consequential damages arising from your use of
            the platform.
          </p>
        </Section>

        <Section title="Termination">
          <p>
            We reserve the right to terminate or restrict access to Hubble for users who
            violate these terms, without notice. Repeat offenders may be permanently banned.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            For questions about these terms, open an issue on our{" "}
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
