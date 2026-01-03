"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";

import { Spinner } from "@/components/ui/spinner";
import { AppDispatch } from "@/store/store";
import {
  registerUser,
  resendConfirmationEmail,
} from "@/store/slices";
import Backimg from "../../../assets/600_500.png";

type FormData = {
  first_name: string;
  last_name: string;
  dob: string;
  email: string;
  password: string;
  confirm_password: string;
  mobile: string;
  referral_token?: string;
};

const RegisterPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const referralToken = searchParams.get("token") || "";
  const hasReferral = Boolean(referralToken);

  const [referrerName, setReferrerName] = useState<string>("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const password = watch("password");

  // Decode referral token for display
  useEffect(() => {
    if (!referralToken) return;

    try {
      const payloadPart = referralToken.split(".")[0];
      const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
      const decoded = atob(padded);
      const data = JSON.parse(decoded);
      setReferrerName(data?.name || "Unknown");
    } catch (err) {
      console.error("Invalid referral token:", err);
      setReferrerName("Unknown");
    }
  }, [referralToken]);

  // Countdown timer for resend email
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const onSubmit = async (formData: FormData) => {
    if (formData.password !== formData.confirm_password) {
      setError("confirm_password", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    const dataToSend = {
      ...formData,
      referral_token: referralToken,
    };

    setLoading(true);

    try {
      await dispatch(registerUser(dataToSend)).unwrap();
      setEmail(formData.email);
      toast.success("Verification email sent. Check your inbox.");
      setShowResend(true);
      setTimer(30);
    }  
   catch (error: any) {
  let message = "An error occurred.";

  // Direct match check
  const isEmailAlreadyExists =
    error?.detail === "Given email already exists";

  // Handle error message
  if (isEmailAlreadyExists) {
    message = error.detail;
  } else if (error?.detail) {
    message = error.detail;
  } else if (error?.message) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (error?.email?.[0]) {
    message = error.email[0];
  } else if (error?.mobile?.[0]) {
    message = error.mobile[0];
  } else if (error?.non_field_errors?.[0]) {
    message = error.non_field_errors[0];
  }

  if (isEmailAlreadyExists) {
    setEmail(formData.email);
    setShowResend(true);
    setTimer(30);
    toast.error(`${message} You can resend the verification email.`);
  } else {
    toast.error(message);
  }
}

    // catch (error: any) {
    //   let message = "An error occurred.";

    //   if (error?.detail) {
    //     message = error.detail;
    //   } else if (error?.message) {
    //     message = error.message;
    //   } else if (typeof error === "string") {
    //     message = error;
    //   } else if (error?.email?.[0]) {
    //     message = error.email[0];
    //   } else if (error?.non_field_errors?.[0]) {
    //     message = error.non_field_errors[0];
    //   }

    //   toast.error(message);
    // }
    finally {
      setLoading(false);
    }
  };


  const handleResendEmail = async () => {
    setResendLoading(true);

    try {
      await dispatch(resendConfirmationEmail({ email })).unwrap();
      toast.success("Verification email resent.");
      setTimer(30);
    } catch (error: any) {
      toast.error(
        error?.detail || error?.message || "Failed to resend. Try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center px-4 lg:px-[100px]"
      style={{ backgroundImage: `url(${Backimg.src})` }}
    >
      <Toaster position="top-right" />

      <div className="flex flex-col items-center bg-black/40 p-8 rounded-lg w-full lg:w-1/2 text-white mt-20">
        <h1 className="text-3xl font-semibold mb-2">Sign Up</h1>
        {referrerName && (
          <p className="mb-4">
            Referred by:{" "}
            <span className="font-bold text-yellow-400">{referrerName}</span>
          </p>
        )}

        <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
          {[
            { name: "first_name", label: "First Name", type: "text" },
            { name: "last_name", label: "Last Name", type: "text" },
            { name: "dob", label: "", type: "date" },
            { name: "email", label: "Email", type: "email" },
            {
              name: "password",
              label: "Password",
              type: showPassword ? "text" : "password",
              toggle: () => setShowPassword(!showPassword),
              isPassword: true,
            },
            {
              name: "confirm_password",
              label: "Confirm Password",
              type: showConfirmPassword ? "text" : "password",
              toggle: () => setShowConfirmPassword(!showConfirmPassword),
              isPassword: true,
            },
            { name: "mobile", label: "Mobile Number", type: "tel" },
          ].map((field) => (
            <div className="mb-4" key={field.name}>
              <TextField
                type={field.type}
                label={field.label}
                fullWidth
                variant="outlined"
                slotProps={{
                  input: {
                    style: {
                      color: "white", 
                      backgroundColor: "transparent",
                    },
                    endAdornment: field.isPassword ? (
                      <InputAdornment position="end">
                        <IconButton onClick={field.toggle}>
                          {field.type === "password" ? (
                            <Visibility className="text-white" />
                          ) : (
                            <VisibilityOff className="text-white" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  },
                  inputLabel: {
                    style: { color: "white" }, 
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "transparent",
                    "& fieldset": { borderColor: "gray" },
                    "&:hover fieldset": { borderColor: "#ec4899" },
                    "&.Mui-focused fieldset": { borderColor: "#ec4899" },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                  },
                  "& .MuiInputLabel-root": {
                    color: "white", 
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ec4899",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "white",
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
                    WebkitTextFillColor: "white !important",
                    caretColor: "white !important",
                    transition: "background-color 5000s ease-in-out 0s",
                  },
                  "& input:-webkit-autofill:focus": {
                    WebkitTextFillColor: "white !important",
                    caretColor: "white !important",
                  },
                }}

                {...register(field.name as keyof FormData, {
                  required: `${field.label} is required`,
                  validate:
                    field.name === "confirm_password"
                      ? (value) => value === password || "Passwords do not match"
                      : undefined,
                })}
              />
              {errors[field.name as keyof FormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name as keyof FormData]?.message as string}
                </p>
              )}
            </div>

          ))}

          {hasReferral ? (
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-700 text-white font-semibold py-2 rounded-md mt-4 hover:scale-105 transition-transform"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Register"}
            </button>
          ) : (
            <p className="text-red-600 text-center mt-4 font-semibold">
              Registration is allowed only via referral links.
            </p>
          )}
        </form>

        {showResend && (
          <div className="mt-4 w-full max-w-sm">
            {timer > 0 && (
              <p className="text-yellow-500 text-center text-sm mb-2">
                Resend available in {timer} seconds.
              </p>
            )}
            <button
              className="w-full bg-red-600 text-white py-2 rounded-md"
              onClick={handleResendEmail}
              disabled={timer > 0 || resendLoading}
            >
              {resendLoading ? <Spinner /> : "Resend Confirmation Email"}
            </button>
          </div>
        )}

        <p className="text-sm mt-4">
          Already have an account?{" "}
          <a
            href="/auth/signin"
            className="text-blue-400 font-semibold hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
