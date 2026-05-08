"use client";
import { CountrySelectField } from "@/components/forms/countryselect";
import Footerlink from "@/components/forms/footerlink";
import InputField from "@/components/forms/Inputsfield";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const STEPS = ["Account", "Preferences", "Watchlist", "Invest"];

const StepIndicator = ({ current = 0 }: { current?: number }) => (
  <ol className="flex items-center gap-0 mb-8">
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <li className="flex flex-col items-center gap-1.5">
          <span
            className={[
              "w-6 h-6 rounded-full flex items-center justify-center",
              "text-[10px] font-bold transition-colors",
              i < current
                ? "bg-yellow-500 text-gray-900"
                : i === current
                ? "border border-yellow-500 text-yellow-500 bg-transparent"
                : "bg-gray-700 text-gray-600",
            ].join(" ")}
          >
            {i + 1}
          </span>
          <span
            className={[
              "text-[10px] font-semibold hidden sm:block tracking-wide",
              i === current ? "text-gray-300" : "text-gray-600",
            ].join(" ")}
          >
            {label}
          </span>
        </li>
        {i < STEPS.length - 1 && (
          <span
            className={[
              "flex-1 h-px mx-1 mb-3",
              i < current ? "bg-yellow-500/50" : "bg-gray-700",
            ].join(" ")}
          />
        )}
      </React.Fragment>
    ))}
  </ol>
);

const SignUp = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "EG",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if(result.success) router.push('/');
        } catch (e) {
            console.error(e);
            toast.error('Sign up failed', {
                description: e instanceof Error ? e.message : 'Failed to create an account.'
            })
        }
    }

  return (
    <>
      <div className="mb-6">
        <h1 className="form-title">Sign up & personalize</h1>
        <p className="form-subtitle">Takes about 60 seconds to get started</p>
      </div>

      <StepIndicator current={0} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row: full name + country */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            name="fullName"
            label="Full name"
            placeholder="Mahmoud"
            register={register}
            error={errors.fullName}
            validation={{
              required: "Full name is required",
              minLength: { value: 2, message: "Minimum 2 characters" },
            }}
          />
          <CountrySelectField
            name="country"
            label="Country"
            control={control}
            error={errors.country}
            required
          />
        </div>

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

        <InputField
          name="password"
          label="Password"
          placeholder="Min. 8 characters"
          type="password"
          register={register}
          error={errors.password}
          validation={{
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
          }}
        />

        {/* Investment profile section */}
        <div className="pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-600 border-t border-gray-700 pt-4 mb-4">
            Investment profile
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <SelectField
              name="investmentGoals"
              label="Goal"
              placeholder="Select goal"
              options={INVESTMENT_GOALS}
              control={control}
              error={errors.investmentGoals}
              required
            />
            <SelectField
              name="riskTolerance"
              label="Risk tolerance"
              placeholder="Select level"
              options={RISK_TOLERANCE_OPTIONS}
              control={control}
              error={errors.riskTolerance}
              required
            />
          </div>

          <SelectField
            name="preferredIndustry"
            label="Preferred industry"
            placeholder="Select industry"
            options={PREFERRED_INDUSTRIES}
            control={control}
            error={errors.preferredIndustry}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-6"
        >
          {isSubmitting ? "Creating account…" : "Start Your Investing Journey →"}
        </Button>

        <Footerlink
          text="Already have an account?"
          linkText="Sign in"
          href="/sign-in"
        />
      </form>
    </>
  );
};

export default SignUp;

