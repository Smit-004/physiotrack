import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getError } from "../utils/getError";

export default function Register() {
  const { user, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(getError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-bold text-teal-700">Register</h1>

        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password (kam se kam 6 characters)</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 rounded bg-teal-600 text-white disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center">
          Pehle se account hai?{" "}
          <Link to="/login" className="text-teal-700 underline">Login</Link>
        </p>
      </form>
    </div>
  );
}