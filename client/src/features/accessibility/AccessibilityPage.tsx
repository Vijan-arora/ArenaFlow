import React from 'react';

export default function AccessibilityPage(): React.JSX.Element {
  return (
    <main className="container container--narrow stack" id="main-content">
      <header className="stack">
        <h1>Accessibility Statement</h1>
        <p className="page-intro">
          Our commitment to digital inclusion, accessibility standards conformance, and support channels.
        </p>
      </header>

      <section className="card stack" aria-labelledby="conformance-heading">
        <h2 id="conformance-heading">Conformance Status</h2>
        <p>
          We firmly believe that the internet should be available and accessible to anyone, and we are committed
          to providing a website that is accessible to the widest possible audience, regardless of circumstance
          and ability.
        </p>
        <p>
          To meet this commitment, the ArenaFlow platform conforms to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
          These guidelines explain how to make web content more accessible for people with a wide array of disabilities.
        </p>
      </section>

      <section className="card stack" aria-labelledby="measures-heading">
        <h2 id="measures-heading">Technical Specifications & Testing</h2>
        <p>
          ArenaFlow relies on standard web technologies including HTML5, CSS3, and JavaScript to function. Conformance is
          validated continuously using automated accessibility testing:
        </p>
        <ul>
          <li><strong>Automated Scanning:</strong> Run on every code change via Axe-Core integration in Playwright E2E tests.</li>
          <li><strong>Keyboard Navigation:</strong> Tested to ensure full operation, interactive focus indicators, and skip-link targets.</li>
          <li><strong>Directional Support:</strong> Built-in bi-directional capability (`dir="auto"`) for right-to-left (RTL) locales.</li>
        </ul>
      </section>

      <section className="card stack" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Feedback & Contact</h2>
        <p>
          Despite our best efforts to ensure accessibility of ArenaFlow, there may be some limitations. If you encounter
          any barriers or require assistance, please contact us:
        </p>
        <ul>
          <li><strong>Email:</strong> accessibility@arenaflow.com</li>
          <li><strong>Primary Phone:</strong> +1 (555) 123-4567</li>
          <li><strong>Alternative Channel:</strong> Visit the Guest Services desks located at Gates 1, 4, and 6 inside the venue.</li>
        </ul>
      </section>
    </main>
  );
}
