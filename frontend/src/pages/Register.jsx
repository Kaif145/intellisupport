import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";
import "./Login.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [pending, setPending] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const busyRef = useRef(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const loading = pending !== null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const showError = (error, fallback) => {
    const message = error?.response?.data?.message;
    const text = typeof message === "string" ? message : fallback;

    setErrorMessage(text);
    toast.error(text);
  };

  const finishLogin = (data, message) => {
    login(data.token, data.company);
    toast.success(message);
    navigate("/dashboard");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (busyRef.current) return;

    if (!form.name.trim()) {
      showError(null, "Please enter your company name.");
      return;
    }

    if (form.password.length < 6) {
      showError(null, "Password must be at least 6 characters.");
      return;
    }

    busyRef.current = true;
    setPending("register");
    setErrorMessage("");

    try {
      const { data } = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      finishLogin(data, "Account created successfully!");
    } catch (error) {
      showError(error, "Unable to create your account. Please try again.");
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
      const { data } = await API.post("/auth/demo");
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
      {/* Brand and illustration */}
      <section
        className="login-story"
        aria-labelledby="register-story-title"
      >
        <Link to="/" className="login-brand">
          <span className="login-brand-icon" aria-hidden="true">
            IS
          </span>
          IntelliSupport
        </Link>

        <div className="login-story-content">
          <p className="login-eyebrow">A BETTER FIRST CONVERSATION</p>

          <h2 id="register-story-title">
            Your business.
            <br />
            Your people.
            <br />
            A little closer.
          </h2>

          <p className="login-story-description">
            Create a home for your customer conversations. Bring your
            knowledge together and help your team deliver thoughtful
            support.
          </p>

          <figure className="login-illustration">
            <img
              src="/support-hero.png"
              alt="Illustration of a support specialist helping a customer."
              width="1448"
              height="1086"
            />
          </figure>

          <div className="login-story-caption">
            <span aria-hidden="true">↗</span>

            <p>
              <strong>Make helpful your everyday.</strong>
              <span>
                From a first question to a personal conversation.
              </span>
            </p>
          </div>
        </div>

        <p className="login-story-footer">
          Your knowledge. Your team. One support workspace.
        </p>
      </section>

      {/* Registration form */}
      <section
        className="login-panel"
        aria-labelledby="register-title"
      >
        <Link to="/" className="login-back">
          <span aria-hidden="true">←</span>
          Back to home
        </Link>

        <div className="login-form-wrap">
          <div className="login-heading">
            <span className="login-label">LET’S GET YOU SET UP</span>

            <h1 id="register-title">
              Make room for better support.
            </h1>

            <p>Create your IntelliSupport workspace.</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="login-form"
            aria-busy={loading}
          >
            <div className="login-field">
              <label htmlFor="register-company">
                Company name
              </label>

              <input
                id="register-company"
                type="text"
                name="name"
                autoComplete="organization"
                value={form.name}
                onChange={handleChange}
                placeholder="Your company or business"
                disabled={loading}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-email">
                Work email
              </label>

              <input
                id="register-email"
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
              <label htmlFor="register-password">
                Create a password
              </label>

              <div className="login-password-wrap">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Choose your password"
                  minLength={6}
                  aria-describedby="register-password-hint"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => {
                    setShowPassword((visible) => !visible);
                  }}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  aria-controls="register-password"
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <small
                id="register-password-hint"
                className="register-password-hint"
              >
                Use at least 6 characters.
              </small>
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
              {pending === "register" ? (
                <>
                  <span
                    className="login-spinner"
                    aria-hidden="true"
                  />
                  Creating your workspace…
                </>
              ) : (
                <>
                  Create your workspace
                  <span className="login-arrow" aria-hidden="true">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>WANT TO LOOK AROUND FIRST?</span>
          </div>

          <button
            type="button"
            className="login-button login-button-demo"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            {pending === "demo" ? (
              <>
                <span
                  className="login-spinner"
                  aria-hidden="true"
                />
                Preparing your demo…
              </>
            ) : (
              <>
                Explore the demo workspace
                <span className="login-arrow" aria-hidden="true">
                  ↗
                </span>
              </>
            )}
          </button>

          <p className="login-demo-hint">
            Explore sample content before creating your own workspace.
          </p>

          <p className="login-register">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>

        <p className="login-panel-footer">
          © {new Date().getFullYear()} IntelliSupport
        </p>
      </section>
    </main>
  );
};

export default Register;