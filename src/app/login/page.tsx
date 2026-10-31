"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "@/providers/AuthProvider";

function LoginForm() {
  const { loginUser, googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password);
      toast.success("Login successful!");
      router.push(redirect);
    } catch (error: any) {
      toast.error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success("Login successful!");
      router.push(redirect);
    } catch (error: any) {
      toast.error(error?.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md mx-auto bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-4">
            Sign in to your StudioSpace account
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control mb-2">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input input-bordered w-full pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right mb-4">
              <span className="text-sm text-indigo-500 hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="divider">OR</div>

          <button
            className="btn btn-outline w-full"
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="text-center mt-4 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-500 hover:underline font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-indigo-500"></span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
