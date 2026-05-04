"use client";
import Footerlink from "@/components/forms/footerlink";
import InputField from "@/components/forms/Inputsfield";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="form-title">Welcome back</h1>
        <p className="form-subtitle">Sign in to your Signalist account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          placeholder="you@example.com"
          register={register}
          error={errors.email}
          validation={{
            required: "Email is required",
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
              message: "Enter a valid email address",
            },
          }}
        />

        <div className="space-y-1.5">
          <InputField
            name="password"
            label="Password"
            placeholder="••••••••"
            type="password"
            register={register}
            error={errors.password}
            validation={{
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
            }}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-gray-500 hover:text-yellow-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-6"
        >
          {isSubmitting ? "Signing in…" : "Start Your Investing Journey →"}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-5">
          <span className="flex-1 h-px bg-gray-700" />
          <span className="text-xs text-gray-600">or</span>
          <span className="flex-1 h-px bg-gray-700" />
        </div>

        <Footerlink
          text="Don't have an account?"
          linkText="Sign up free"
          href="/sign-up"
        />
      </form>
    </>
  );
};

export default SignIn;
