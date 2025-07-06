"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";

interface NewsletterSignupProps {
  audienceId?: string;
  title?: string;
  description?: string;
  className?: string;
  layout?: "vertical" | "horizontal";
  showHeader?: boolean;
}

export default function NewsletterSignup({
  audienceId,
  title = "Join my newsletter",
  description = "Get my latest methods, tips, and insights delivered directly to your inbox.",
  className = "",
  layout = "vertical",
  showHeader = true,
}: NewsletterSignupProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          audienceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSuccess(true);
      setFormData({ email: "", firstName: "", lastName: "" });

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("py-8", className)}
      >
        <div className="text-center">
          <CheckCircle className="mx-auto mb-3 w-6 h-6 text-green-400" />
          <h3 className="mb-2 text-lg font-medium text-white font-clash">
            Welcome aboard! 🎉
          </h3>
          <p className="text-sm text-white/60">
            Check your email for a confirmation link.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn("py-8", className)}>
      {layout === "horizontal" ? (
        // Horizontal Layout
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          {/* Text Content */}
          {showHeader && (
            <div className="mb-6 lg:mb-0 lg:flex-1">
              <h3 className="mb-2 text-xl font-bold text-white lg:text-2xl font-clash">
                {title}
              </h3>
              <p className="text-sm lg:text-base text-white/60">
                {description}
              </p>
            </div>
          )}

          {/* Form */}
          <div
            className={cn("lg:max-w-md", showHeader ? "lg:flex-1" : "mx-auto")}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="your@email.com"
                required
                className="px-4 py-3 w-full text-white bg-transparent border-b transition-colors duration-300 placeholder-white/40 border-white/20 focus:outline-none focus:border-white/40"
              />

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder="First name"
                  className="px-4 py-3 w-full text-white bg-transparent border-b transition-colors duration-300 placeholder-white/40 border-white/20 focus:outline-none focus:border-white/40"
                />
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  placeholder="Last name"
                  className="px-4 py-3 w-full text-white bg-transparent border-b transition-colors duration-300 placeholder-white/40 border-white/20 focus:outline-none focus:border-white/40"
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-2 text-sm text-center text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.email}
                className="py-3 w-full text-sm font-medium transition-colors duration-300 text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex justify-center items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Subscribing...</span>
                  </span>
                ) : (
                  "Subscribe →"
                )}
              </button>

              {/* Privacy Note */}
              <p className="pt-2 text-xs text-center text-white/40">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      ) : (
        // Vertical Layout (Original)
        <>
          {showHeader && (
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-xl font-bold text-white font-clash">
                {title}
              </h3>
              <p className="text-sm text-white/60">{description}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mx-auto space-y-4 max-w-md">
            {/* Email Input */}
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="your@email.com"
              required
              className="px-4 py-3 w-full text-white bg-transparent border-b transition-colors duration-300 placeholder-white/40 border-white/20 focus:outline-none focus:border-white/40"
            />

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                placeholder="First name"
                className="px-4 py-3 w-full text-white bg-transparent border-b transition-colors duration-300 placeholder-white/40 border-white/20 focus:outline-none focus:border-white/40"
              />
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Last name"
                className="px-4 py-3 w-full text-white bg-transparent border-b transition-colors duration-300 placeholder-white/40 border-white/20 focus:outline-none focus:border-white/40"
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="py-2 text-sm text-center text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.email}
              className="py-3 w-full text-sm font-medium transition-colors duration-300 text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex justify-center items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </span>
              ) : (
                "Subscribe →"
              )}
            </button>

            {/* Privacy Note */}
            <p className="pt-2 text-xs text-center text-white/40">
              No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        </>
      )}
    </div>
  );
}
