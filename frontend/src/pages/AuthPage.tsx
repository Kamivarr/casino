import { useState} from "react";
import type { ChangeEvent, FormEvent} from "react";

import "../styles/auth.css";

interface FormData {
  username?: string;
  email: string;
  password: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState<FormData>({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Błąd serwera");
      alert(isLogin ? "Zalogowano!" : "Zarejestrowano!");
      setForm({ username: "", email: "", password: "" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Logowanie" : "Rejestracja"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Nazwa użytkownika"
              value={form.username}
              onChange={handleChange}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            value={form.password}
            onChange={handleChange}
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit">{isLogin ? "Zaloguj się" : "Zarejestruj się"}</button>
        </form>
        <div className="auth-switch">
          {isLogin ? "Nie masz konta? " : "Masz już konto? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Zarejestruj się" : "Zaloguj się"}
          </span>
        </div>
      </div>
    </div>
  );
}
