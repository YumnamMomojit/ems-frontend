import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "~/hooks/AuthContext";
import { login } from "~/services/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff, BarChart2, Users, Shield } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const { user, login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      const role = user.role?.toUpperCase();
      if (role === "ADMIN" || role === "SUPER_ADMIN" || role === "ORG_ADMIN") navigate("/admin/dashboard");
      else if (role === "HR") navigate("/hr/dashboard");
      else if (role === "MANAGER") navigate("/manager/dashboard");
      else navigate("/employee/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setApiError("");
    try {
      const response = await login(data.email, data.password);
      authLogin(response);
    } catch (err) {
      setApiError(err.message || "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row w-full bg-[#fafafa] font-['Manrope',sans-serif] text-[#111827] antialiased">
      {/* Left Side: Value Proposition */}
      <section className="relative w-full md:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-[#f4f7fe] overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: "linear-gradient(#004bdc 1px, transparent 1px), linear-gradient(90deg, #004bdc 1px, transparent 1px)", backgroundSize: "100px 100px", opacity: 0.03 }}></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-white/60 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#dae5ff]/50 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-[#004bdc] font-bold tracking-widest text-sm uppercase mb-4">
            EMS
          </div>
          <h1 className="text-[#0f172a] text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-16">
            Join the modern <br /> workforce.
          </h1>

          <div className="space-y-10">
            <div className="flex items-start gap-5">
              <div className="bg-[#004bdc] text-white p-2.5 rounded-lg flex-shrink-0 mt-1 shadow-sm">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[#0f172a] text-xl font-bold mb-1">Unified HR Intelligence</h3>
                <p className="text-[#475569] leading-relaxed">Access your payroll, benefits, and performance metrics in one secure place.</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="text-[#004bdc] p-2.5 rounded-lg flex-shrink-0 mt-1">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[#0f172a] text-xl font-bold mb-1">Seamless Collaboration</h3>
                <p className="text-[#475569] leading-relaxed">Connect with your team across departments in a high-fidelity workspace.</p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <div className="w-16 h-1 bg-[#004bdc] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Form Section (Split Right) */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-20 lg:px-32 bg-[#fafafa]">
        <div className="w-full max-w-[420px]">
          <div className="mb-10">
            <h2 className="text-[#0f172a] text-[32px] font-extrabold tracking-tight mb-2">Sign in to your account</h2>
            <p className="text-[#475569]">
              Don't have an account? <Link to="/register" className="text-[#004bdc] font-bold hover:underline">Request access</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[#334155] text-sm font-semibold">Professional Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full h-[52px] bg-[#f0f3fa] border-none rounded focus:ring-2 focus:ring-[#004bdc] focus:bg-white transition-colors px-4 text-[#0f172a] placeholder-[#94a3b8]"
                placeholder="name@company.com"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[#334155] text-sm font-semibold">Password</label>
                <a className="text-[#004bdc] text-sm font-bold hover:underline" href="#">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full h-[52px] bg-[#f0f3fa] border-none rounded focus:ring-2 focus:ring-[#004bdc] focus:bg-white transition-colors pl-4 pr-12 text-[#0f172a] placeholder-[#94a3b8]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0f172a] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-start gap-3 py-1">
              <input
                type="checkbox"
                id="remember"
                className="mt-1 w-[18px] h-[18px] rounded border-[#cbd5e1] text-[#004bdc] focus:ring-[#004bdc]"
              />
              <label htmlFor="remember" className="text-sm text-[#475569]">
                Keep me signed in for 30 days
              </label>
            </div>

            {apiError && (
              <div className="p-3 text-sm rounded bg-red-50 text-red-700 flex items-start gap-2 border border-red-100">
                <p>{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0042b5] hover:bg-[#00389a] text-white font-bold h-[52px] rounded active:scale-[0.98] transition-all flex justify-center items-center shadow-md shadow-[#0042b5]/20"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in to Dashboard"}
            </button>
          </form>

          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2e8f0]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#fafafa] px-4 text-xs font-bold text-[#64748b] uppercase tracking-widest">
                ENTERPRISE SSO
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button type="button" className="w-full h-[52px] bg-[#f1f4f9] hover:bg-[#e2e8f0] text-[#1e293b] font-semibold rounded flex items-center justify-center gap-3 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Continue with Google
            </button>
            <button type="button" className="w-full h-[52px] bg-[#f1f4f9] hover:bg-[#e2e8f0] text-[#1e293b] font-semibold rounded flex items-center justify-center gap-3 transition-colors">
              <Shield className="w-5 h-5 text-[#004bdc]" />
              Continue with Azure AD
            </button>
          </div>

          <footer className="mt-16 flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            <span>© 2026 EMS</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#004bdc] transition-colors">HELP</a>
              <a href="#" className="hover:text-[#004bdc] transition-colors">SECURITY</a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
