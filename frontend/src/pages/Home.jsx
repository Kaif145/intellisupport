import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const examples = [
  {
    label: "Answer questions",
    title: "Give everyday questions a clear answer.",
    description:
      "Help customers find information from your business content, right inside your website.",
    customer: "Where can I find help getting started?",
    response:
      "Start with our setup guide. It walks through creating your workspace, adding your content, and setting up the website widget.",
    status: "AI assistance",
    note: "Example source: Getting started guide",
  },
  {
    label: "Bring in a person",
    title: "A human touch, when it matters.",
    description:
      "Move a conversation to your team when a customer needs more help. Keep the conversation context close.",
    customer: "Can someone help me with my account?",
    response:
      "Of course. I’ll pass this conversation to the support team so they can review your account question.",
    status: "Handover requested",
    note: "Conversation context stays with the request",
  },
  {
    label: "Keep the context",
    title: "Pick up where the conversation left off.",
    description:
      "Review earlier messages so your team can understand the question before replying.",
    customer: "I contacted you earlier about setting up my widget.",
    response:
      "I can see the earlier messages in this conversation. Tell me which setup step you need help with.",
    status: "Conversation history",
    note: "Example conversation · Sample content",
  },
];

const steps = [
  {
    number: "01",
    title: "Add your knowledge.",
    text: "Bring together the FAQs and help content your customers need.",
  },
  {
    number: "02",
    title: "Make it your own.",
    text: "Choose your assistant’s name, color, and welcome message.",
  },
  {
    number: "03",
    title: "Meet your customers.",
    text: "Add the widget to your website and manage conversations from your workspace.",
  },
];

const questions = [
  {
    title: "What can I add to the knowledge base?",
    answer:
      "Use your business FAQs, policies, and product documentation. Check the upload screen in your workspace for supported file formats and limits.",
  },
  {
    title: "Can a customer speak to a person?",
    answer:
      "IntelliSupport includes a human handover workflow. Your team can review the conversation and take over when a question needs personal attention.",
  },
  {
    title: "Is the conversation on this page live?",
    answer:
      "No. This is an interactive product illustration using sample messages. Sign in to use your actual workspace and chatbot.",
  },
  {
    title: "Which channels are available?",
    answer:
      "This page focuses on the website chat widget. Additional channel integrations should be confirmed in your workspace before you rely on them.",
  },
];

function Arrow({ diagonal = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h16m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

function Brand() {
  return (
    <Link to="/" className="is-brand" aria-label="IntelliSupport home">
      <span className="is-brand-mark" aria-hidden="true">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 5h14v11H9l-4 4V5Z" />
          <path d="M9 9h6M9 12h4" />
        </svg>
      </span>
      IntelliSupport
    </Link>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeExample, setActiveExample] = useState(0);
  const example = examples[activeExample];

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="is-home">
      <a className="is-skip" href="#main-content">
        Skip to content
      </a>

      <header className="is-header">
        <div className="is-container is-nav">
          <Brand />

          <button
            type="button"
            className="is-menu-button"
            aria-expanded={menuOpen}
            aria-controls="home-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
            <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
          </button>

          <nav
            id="home-navigation"
            className={`is-nav-links ${menuOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            <a href="#product" onClick={closeMenu}>Product</a>
            <a href="#how" onClick={closeMenu}>How it works</a>
            <a href="#questions" onClick={closeMenu}>FAQs</a>

            <div className="is-nav-actions">
              <Link to="/login" onClick={closeMenu}>Log in</Link>
              <Link
                to="/register"
                className="is-button is-button-small"
                onClick={closeMenu}
              >
                Get started <Arrow />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="is-container is-hero">
          <div className="is-hero-copy">
            <p className="is-eyebrow">
              <span className="is-status-dot" />
              A little more human. A lot more helpful.
            </p>

            <h1>
              Good support.
              <br />
              <span>Great conversations.</span>
            </h1>

            <p className="is-lead">
              Give everyday questions a helpful answer. Bring your team
              into the conversation when it matters. Keep it all together
              with IntelliSupport.
            </p>

            <div className="is-actions">
              <Link to="/register" className="is-button">
                Create your workspace <Arrow />
              </Link>
              <a href="#product" className="is-text-link">
                Explore the product <span aria-hidden="true">↘</span>
              </a>
            </div>

            <div className="is-hero-note">
              <span aria-hidden="true">✓</span>
              Your knowledge. Your widget. Your customer conversations.
            </div>
          </div>

          <figure className="is-hero-art">
            <div className="is-art-label">
              <span className="is-status-dot" />
              Built around people
            </div>

            <img
              src="/support-hero.webp"
              alt="Illustration of a support specialist helping a customer."
              width="1448"
              height="1086"
              fetchPriority="high"
            />

            <figcaption>
              <span className="is-caption-icon" aria-hidden="true">↗</span>
              <div>
                <strong>Technology that keeps people close.</strong>
                <span>AI assistance, with room for a human touch.</span>
              </div>
            </figcaption>
          </figure>
        </section>

        <div className="is-capabilities">
          <div className="is-container is-capability-row">
            <span>One connected support experience</span>
            <strong>Business knowledge</strong>
            <span className="is-separator" aria-hidden="true">/</span>
            <strong>Website chat</strong>
            <span className="is-separator" aria-hidden="true">/</span>
            <strong>Human handover</strong>
          </div>
        </div>

        <section id="product" className="is-container is-section">
          <div className="is-section-heading">
            <div>
              <p className="is-eyebrow">THE PRODUCT, IN PRACTICE</p>
              <h2>
                Less back and forth.
                <br />
                More moving forward.
              </h2>
            </div>
            <p>
              From the first question to the next helpful step,
              give every conversation a place to go.
            </p>
          </div>

          <div className="is-product-layout">
            <div
              className="is-scenarios"
              role="group"
              aria-label="Choose a product example"
            >
              {examples.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  className={`is-scenario ${
                    activeExample === index ? "is-selected" : ""
                  }`}
                  aria-pressed={activeExample === index}
                  aria-controls="conversation-preview"
                  onClick={() => setActiveExample(index)}
                >
                  <span className="is-scenario-number">
                    0{index + 1}
                  </span>
                  <span>
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </span>
                  <Arrow diagonal />
                </button>
              ))}
            </div>

            <div className="is-preview-stage">
              <div className="is-preview-label">
                <span>INTELLISUPPORT / WORKSPACE</span>
                <span>Product preview</span>
              </div>

              <div
                id="conversation-preview"
                className="is-chat"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="is-chat-header">
                  <span className="is-chat-avatar" aria-hidden="true">IS</span>
                  <div>
                    <strong>Customer support</strong>
                    <span>{example.status}</span>
                  </div>
                  <span className="is-sample-badge">Sample</span>
                </div>

                <div className="is-chat-body">
                  <p className="is-chat-date">Illustrative conversation</p>

                  <div className="is-message is-customer-message">
                    <span>Customer</span>
                    <p>{example.customer}</p>
                  </div>

                  <div className="is-message is-assistant-message">
                    <span>IntelliSupport</span>
                    <p>{example.response}</p>
                  </div>

                  <div className="is-source-note">
                    <span aria-hidden="true">↳</span>
                    {example.note}
                  </div>
                </div>

                <div className="is-chat-footer">
                  Sample messages, not a live chat
                  <span aria-hidden="true">✳</span>
                </div>
              </div>

              <p className="is-preview-caption">{example.title}</p>
            </div>
          </div>
        </section>

        <section className="is-detail-section">
          <div className="is-container is-detail-grid">
            <div className="is-detail-intro">
              <p className="is-eyebrow">A WORKSPACE THAT MAKES SENSE</p>
              <h2>
                Everything in context.
                <br />
                Everyone on the same page.
              </h2>
              <Link to="/register" className="is-text-link">
                Explore your workspace <Arrow />
              </Link>
            </div>

            <div className="is-detail-list">
              <article>
                <span className="is-detail-number">01 / KNOWLEDGE</span>
                <h3>Your content, put to work.</h3>
                <p>
                  Bring your business information into the support
                  experience so customers can find useful answers.
                </p>
              </article>
              <article>
                <span className="is-detail-number">02 / EXPERIENCE</span>
                <h3>A familiar face on your website.</h3>
                <p>
                  Customize the widget’s appearance and welcome message
                  to feel like part of your business.
                </p>
              </article>
              <article>
                <span className="is-detail-number">03 / CONVERSATIONS</span>
                <h3>Keep the whole story close.</h3>
                <p>
                  Review conversation history and help your team
                  understand what the customer needs next.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="how" className="is-container is-section">
          <div className="is-section-heading">
            <div>
              <p className="is-eyebrow">GETTING STARTED</p>
              <h2>A thoughtful setup.<br />A helpful first impression.</h2>
            </div>
            <p>
              Start with your content. Shape the experience.
              Then bring it to your website.
            </p>
          </div>

          <div className="is-steps">
            {steps.map((step) => (
              <article key={step.number} className="is-step">
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="questions" className="is-container is-faq-section">
          <div>
            <p className="is-eyebrow">A FEW MORE DETAILS</p>
            <h2>Good questions.<br />Clear answers.</h2>
          </div>

          <div className="is-faq-list">
            {questions.map((question) => (
              <details key={question.title}>
                <summary>
                  {question.title}
                  <span className="is-faq-plus" aria-hidden="true">+</span>
                </summary>
                <p>{question.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="is-container is-closing-wrap">
          <div className="is-closing">
            <div>
              <p className="is-eyebrow">LET’S MAKE SUPPORT FEEL BETTER</p>
              <h2>Your next great<br />conversation starts here.</h2>
            </div>
            <div className="is-closing-actions">
              <Link to="/register" className="is-button is-button-light">
                Create your workspace <Arrow />
              </Link>
              <Link to="/login">Already have an account? Log in</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="is-container is-footer">
        <div className="is-footer-top">
          <div>
            <Brand />
            <p>Helpful technology. Human connections.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#product">Product</a>
            <a href="#how">How it works</a>
            <a href="#questions">FAQs</a>
            <Link to="/login">Log in</Link>
          </nav>
        </div>

        <div className="is-footer-bottom">
          <span>
            © {new Date().getFullYear()} IntelliSupport.
          </span>
          <span>Made for better conversations.</span>
        </div>
      </footer>
    </div>
  );
}