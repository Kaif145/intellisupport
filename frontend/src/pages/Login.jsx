import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [pending, setPending] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const busyRef = useRef(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const loading = pending !== null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
    setErrorMessage("");
  };

  const finishLogin = (data, message) => {
    login(data.token, data.company);
    toast.success(message);
    navigate("/dashboard");
  };

  const showError = (error, fallback) => {
    const message = error.response?.data?.message;
    const text = typeof message === "string" ? message : fallback;

    setErrorMessage(text);
    toast.error(text);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busyRef.current) return;

    busyRef.current = true;
    setPending("login");
    setErrorMessage("");

    try {
      const { data } = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      finishLogin(data, "Welcome back!");
    } catch (error) {
      showError(error, "Unable to sign in. Please try again.");
    } finally {
      busyRef.current = false;
      setPending(null);
    }
  };

  const handleDemoLogin = async () => {
    if (busyRef.current) return;

    busyRef.current = true;
    setPending("demo");
    setErrorMessage("");

    try {
      let data;

      try {
        const response = await API.post("/auth/demo");
        data = response.data;
      } catch {
        // Preserves your existing demo-account fallback.
        const response = await API.post("/auth/login", {
          email: "demo@intellisupport.app",
          password: "DemoPass123!",
        });

        data = response.data;
      }

      finishLogin(data, "Demo workspace ready");
    } catch (error) {
      showError(error, "Unable to open the demo. Please try again.");
    } finally {
      busyRef.current = false;
      setPending(null);
    }
  };

  return (
    <main className="login-page">
      <section className="login-story" aria-labelledby="login-story-title">
        <Link to="/" className="login-brand">
          <span className="login-brand-icon" aria-hidden="true">IS</span>
          IntelliSupport
        </Link>

        <div className="login-story-content">
          <p className="login-eyebrow">BUILT AROUND PEOPLE</p>

          <h2 id="login-story-title">
            Every conversation.
            <br />
            A little more human.
          </h2>

          <p className="login-story-description">
            Your knowledge, your team, and your customer conversations.
            Together in one thoughtful workspace.
          </p>

          <figure className="login-illustration">
            <img
              src="/support-hero.webp"
              alt="Illustration of a support specialist helping a customer."
              width="1448"
              height="1086"
            />
          </figure>

          <div className="login-story-caption">
            <span aria-hidden="true">↗</span>
            <p>
              <strong>Helpful technology. Human connections.</strong>
              <span>Make room for the conversations that matter.</span>
            </p>
          </div>
        </div>

        <p className="login-story-footer">
          A workspace for better customer support.
        </p>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <Link to="/" className="login-back">
          <span aria-hidden="true">←</span>
          Back to home
        </Link>

        <div className="login-form-wrap">
          <div className="login-heading">
            <span className="login-label">YOUR WORKSPACE AWAITS</span>
            <h1 id="login-title">Good to see you again.</h1>
            <p>Sign in to pick up the conversation.</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="login-form"
            aria-busy={loading}
          >
            <div className="login-field">
              <label htmlFor="login-email">Work email</label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                disabled={loading}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>

              <div className="login-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  aria-controls="login-password"
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="login-error" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="login-button login-button-primary"
              disabled={loading}
            >
              {pending === "login" ? (
                <>
                  <span className="login-spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in to workspace
                  <span className="login-arrow" aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>NEW TO INTELLISUPPORT?</span>
          </div>

          <button
            type="button"
            className="login-button login-button-demo"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            {pending === "demo" ? (
              <>
                <span className="login-spinner" aria-hidden="true" />
                Preparing your demo…
              </>
            ) : (
              <>
                Explore the demo workspace
                <span className="login-arrow" aria-hidden="true">↗</span>
              </>
            )}
          </button>

          <p className="login-demo-hint">
            Take a look around with sample content.
            No account creation needed.
          </p>

          <p className="login-register">
            Ready for your own workspace?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>

        <p className="login-panel-footer">
          © {new Date().getFullYear()} IntelliSupport
        </p>
      </section>
    </main>
  );
};

export default Login;