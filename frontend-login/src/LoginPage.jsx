import { useState } from "react";
import "./LoginPage.css";

const HERO_IMAGE = "/images/Talenavi.png";
const HERO_IMAGE_MOBILE = "/images/TalenaviMobile.png";
const LOGO_IMAGE = "/images/image.png";

const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) {
    errors.email = "Email wajib diisi";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Format email tidak valid";
  }
  if (!password) {
    errors.password = "Password wajib diisi";
  } else if (password.length < 6) {
    errors.password = "Password minimal 6 karakter";
  }
  return errors;
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    // Tidak valid -> tampilkan pesan error
    if (Object.keys(validationErrors).length > 0) {
      setFormError("Login gagal. Periksa kembali email dan password kamu.");
      return;
    }

    // Valid -> simpan ke localStorage
    setFormError("");
    localStorage.setItem("email", form.email.trim());
    localStorage.setItem("isLoggedIn", "true");

    console.log("Login berhasil");
    alert("Login berhasil!");
  };

  return (
    <div
      className="login"
      style={{
        "--hero-image": `url(${HERO_IMAGE})`,
        "--hero-image-mobile": `url(${HERO_IMAGE_MOBILE})`,
      }}
    >
      <div className="login__card">
        <section className="login__hero" aria-hidden="true" />

        <section className="login__panel">
          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <img
              className="login__logo"
              src={LOGO_IMAGE}
              alt="Logo"
              width="110"
              height="110"
            />
            <h1 className="login__title">Selamat Datang Kembali!</h1>

            {formError && (
              <div className="login__alert" role="alert">
                {formError}
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="field__error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="field__password">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span id="password-error" className="field__error">
                  {errors.password}
                </span>
              )}
            </div>

            <a className="login__forgot" href="/forgot-password">
              Lupa Password?
            </a>

            <button className="login__submit" type="submit">
              Sign In
            </button>

            <p className="login__register">
              Belum punya akun? <a href="/register">Daftar di sini</a>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}