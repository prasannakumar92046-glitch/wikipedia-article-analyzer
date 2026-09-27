import { useState } from "react";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";

import {
  ShieldCheck,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import "./App.css";


function Router() {
  const path = window.location.pathname;

  const storedUser = localStorage.getItem(
    "wikiquality_user"
  );

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  if (path === "/dashboard") {
    if (!user || user.role !== "user") {
      window.location.href = "/";
      return null;
    }

    return <Dashboard />;
  }

  if (path === "/admin") {
    if (!user || user.role !== "admin") {
      window.location.href = "/";
      return null;
    }

    return <AdminDashboard />;
  }

  return <LoginPage />;
}

// -----------------------------
// LOGIN PAGE
// -----------------------------

function LoginPage() {
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      email: email.trim().toLowerCase(),
      password: password,
      role: role,
    };

    console.log("Login request:", {
      email: loginData.email,
      role: loginData.role,
    });

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        let message = "Login failed.";

        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          message = data.detail
            .map((item) => item.msg)
            .join(", ");
        }

        throw new Error(message);
      }

      // Save authentication information
      if (data.token) {
        localStorage.setItem(
          "wikiquality_token",
          data.token
        );
      }

      localStorage.setItem(
        "wikiquality_user",
        JSON.stringify(data.user)
      );

      console.log("Authenticated user:", data.user);

      // Redirect according to backend role
      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }

    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <div className="background-shape background-shape-one"></div>
      <div className="background-shape background-shape-two"></div>

      <main className="login-container">

        {/* LEFT BRAND SECTION */}

        <section className="brand-section">

          <div className="brand-icon">
            <Brain size={34} strokeWidth={2.2} />
          </div>

          <h1>
            WikiQuality <span>AI</span>
          </h1>

          <p className="tagline">
            AI-Powered Wikipedia Knowledge Quality &
            Completeness Platform
          </p>

          <div className="feature-list">

            <div className="feature-item">

              <div className="feature-icon">
                <Sparkles size={18} />
              </div>

              <div>
                <strong>Intelligent Analysis</strong>

                <p>
                  Analyze content quality using NLP and
                  AI techniques.
                </p>
              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon">
                <Brain size={18} />
              </div>

              <div>
                <strong>Knowledge Insights</strong>

                <p>
                  Explore topics, entities, evidence and
                  information diversity.
                </p>
              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>Evidence-Based Results</strong>

                <p>
                  Understand why an article receives its
                  analysis results.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* LOGIN CARD */}

        <section className="login-card">

          <div className="login-header">

            <div className="small-brand">
              <Brain size={20} />
              <span>WikiQuality AI</span>
            </div>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your{" "}
              {role === "user"
                ? "analysis dashboard"
                : "administration panel"}.
            </p>

          </div>


          {/* ROLE SELECTOR */}

          <div className="role-selector">

            <button
              type="button"
              className={`role-button ${
                role === "user" ? "active" : ""
              }`}
              onClick={() => setRole("user")}
              disabled={loading}
            >
              <UserRound size={18} />
              <span>User</span>
            </button>


            <button
              type="button"
              className={`role-button ${
                role === "admin" ? "active" : ""
              }`}
              onClick={() => setRole("admin")}
              disabled={loading}
            >
              <ShieldCheck size={18} />
              <span>Admin</span>
            </button>

          </div>


          {/* LOGIN FORM */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">

                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  disabled={loading}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    alert(
                      "Password recovery will be implemented in a later step."
                    )
                  }
                  disabled={loading}
                >
                  Forgot password?
                </button>

              </div>


              <div className="input-wrapper">

                <LockKeyhole size={19} />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  disabled={loading}
                  required
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Signing in..."
                  : role === "user"
                  ? "Login as User"
                  : "Login as Admin"}
              </span>

              {!loading && (
                <ArrowRight size={20} />
              )}

            </button>

          </form>


          {/* FOOTER */}

          <div className="login-footer">

            <p>
              {role === "user"
                ? "Analyze articles and explore knowledge insights."
                : "Manage users, analyses and system information."}
            </p>

          </div>

        </section>

      </main>


      <footer className="page-footer">

        <span>WikiQuality AI</span>

        <span>•</span>

        <span>
          AI-Powered Knowledge Quality Analysis
        </span>

      </footer>

    </div>
  );
}


// -----------------------------
// TEMPORARY ADMIN PAGE
// -----------------------------

function AdminPage() {

  const user = JSON.parse(
    localStorage.getItem("wikiquality_user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("wikiquality_token");
    localStorage.removeItem("wikiquality_user");

    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fb",
      }}
    >

      <h1>
        WikiQuality AI — Admin Dashboard
      </h1>

      <p>
        Welcome, {user?.name || "Administrator"}
      </p>

      <p>
        Role: {user?.role || "admin"}
      </p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

    </div>
  );
}


export default Router;