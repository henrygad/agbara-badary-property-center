"use client";

import PageLoader from "@/components/loaders/PageLoader";
import { validateEmail } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifySuccess() {
  const router = useRouter();
  const query = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  // Auto fill data
  useEffect(() => {
    setIsLoading(true);

    const emailParam = query.get("email");
    const otpParam = query.get("otp");

    if (otpParam && emailParam) {
      async function autoVerifyAccount({ email, otp }: { email: string, otp: string }) {

        // Validate the entries
        if (!email || !validateEmail(email)) {
          setError("Invalid email address");
        }

        if (!otp || otp.length !== 6) {
          setError("Invalid OTP");
        }

        try {
          const payload = { otp, email };

          const res = await fetch("/api/otp/verify/resetpassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const resData = await res.json() as { message: string, success: boolean };

          if (!resData.success) {
            console.log(resData);
            setError(resData.message);

          } else {
            console.log(resData);
            router.push("/auth/forget-password/reset?email=" + email);
          }        

        } catch (error) {
          console.error(error);
          console.log(error);
          setError("Please Try again later.")

        } finally {
          setIsLoading(false);
        }          
      };

      autoVerifyAccount({ email: emailParam, otp: otpParam });
    }
  }, [query, router]);

   if (isLoading) {
      return <PageLoader loading={isLoading} />
    }

  if (error) {
    return <div className="w-full h-[50vh] flex justify-center items-center">
      <p className="text-red-600 text-sm mb-3 font-medium">{error}</p>
    </div>
  }

  return (
    <div>
    </div>
  );
}
