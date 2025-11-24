"use client";
import React from "react";

// Component Imports
import Button from "@/components/buttons/Button";
import FormField from "@/components/formItems/FormField";

// Library Imports
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Lock, LogIn, User } from "lucide-react";
import logo from "@/assets/favicon.png";

//  Mock User Data
const MOCK_USERS = {
  Devanshi: "Devanshi2901",
  Ninad: "Ninad3110",
};

//  Yup Validation Schema
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AuthForm = () => {
  const router = useRouter();

  const initialValues = { username: "", password: "" };

  const handleAuthSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const { username, password } = values;

      // Mock Login: Check if username exists and password matches
      if (MOCK_USERS[username] === password) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_user", username);
        }

        toast.success(`Welcome back, ${username}!`);
        router.push("/word"); // Redirect on successful login
      } else {
        toast.error("Invalid username or password.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during authentication.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--slate-50)] p-4 font-sans">
      <div className="w-full max-w-sm bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-[var(--slate-100)]">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center">
            <img src={logo.src} alt="Logo" className="h-7 w-7 inline-block mr-0.5" />
            <h1 className="logo text-2xl mt-1 font-extrabold uppercase tracking-wider text-[var(--primary)] leading-none">
              ordSmith
            </h1>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleAuthSubmit}
        >
          {({ isSubmitting, isValid }) => {
            return (
              <Form>
                <div className="space-y-4">
                  <FormField
                    label="Username"
                    id="username"
                    type="text"
                    icon={User}
                    placeholder="Enter username"
                    required
                  />
                  <FormField
                    label="Password"
                    id="password"
                    type="password"
                    icon={Lock}
                    placeholder="password (min 6 characters)"
                    required
                  />

                  {/* Submit Button */}
                  <Button
                    variant="transparent"
                    type="submit"
                    icon={LogIn}
                    disabled={isSubmitting || !isValid}
                    className="w-full mt-4 bg-[var(--primary)] text-white hover:bg-[var(--primary-600)] flex items-center justify-center gap-2 p-3 rounded-lg font-semibold transition"
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AuthForm;
