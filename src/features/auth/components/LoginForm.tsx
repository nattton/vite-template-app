import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useLoginMutation } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { loginSchema } from "../types/auth";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login: setStoreAuth, isAuthenticated, user } = useAuthStore();
  const loginMutation = useLoginMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});
    setSuccessMsg(null);

    // Validate inputs with Zod
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      const formatted = result.error.format();
      setFieldErrors({
        username: formatted.username?._errors[0],
        password: formatted.password?._errors[0],
      });
      return;
    }

    try {
      // Execute login using TanStack Query Mutation
      await setStoreAuth({ username, password });
      setSuccessMsg("Login successful! Redirecting...");
      setTimeout(() => {
        navigate({ to: "/" });
      }, 800);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else if (
        err.message === "Network Error" ||
        err.code === "ERR_NETWORK"
      ) {
        setErrorMsg(
          "Unable to connect to http://localhost:4000. Please ensure your backend server is running.",
        );
      } else {
        setErrorMsg(
          err.message || "Login failed. Please check your credentials.",
        );
      }
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className='w-full max-w-md p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-center space-y-6'>
        <div className='w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400'>
          <CheckCircle2 className='w-8 h-8' />
        </div>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold text-slate-100'>
            Already Authenticated
          </h2>
          <p className='text-sm text-slate-400'>
            You are logged in as{" "}
            <span className='font-semibold text-indigo-400'>{user.name}</span> (
            {user.role})
          </p>
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className='w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-500/20'
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const isSubmitting = loginMutation.isPending;

  return (
    <div className='w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl space-y-6'>
      {/* Header */}
      <div className='space-y-2 text-center'>
        <div className='w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 mb-4'>
          <LogIn className='w-6 h-6' />
        </div>
        <h1 className='text-2xl font-bold text-white tracking-tight'>
          Welcome Back
        </h1>
        <p className='text-sm text-slate-400'>
          Enter your credentials to access your account
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className='p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 text-red-400 flex-shrink-0 mt-0.5' />
          <div className='space-y-1'>
            <p className='font-semibold text-red-200'>Authentication Error</p>
            <p className='text-xs text-red-300/90'>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMsg && (
        <div className='p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-sm flex items-center gap-3'>
          <CheckCircle2 className='w-5 h-5 text-emerald-400 flex-shrink-0' />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Username */}
        <div className='space-y-1.5'>
          <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
            Username
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
              <User className='w-4 h-4' />
            </div>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter username'
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border ${
                fieldErrors.username
                  ? "border-red-500/80 focus:ring-red-500/30"
                  : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
              } rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all text-sm`}
            />
          </div>
          {fieldErrors.username && (
            <p className='text-xs text-red-400 mt-1'>{fieldErrors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className='space-y-1.5'>
          <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300'>
            Password
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
              <Lock className='w-4 h-4' />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter password'
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border ${
                fieldErrors.password
                  ? "border-red-500/80 focus:ring-red-500/30"
                  : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
              } rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all text-sm`}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors'
            >
              {showPassword ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className='text-xs text-red-400 mt-1'>{fieldErrors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2'
        >
          {isSubmitting ? (
            <>
              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <LogIn className='w-4 h-4' />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
