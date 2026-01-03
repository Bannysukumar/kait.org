import { Suspense } from "react";
import RegisterClient from "./register"

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading signup...</div>}>
      <RegisterClient />
    </Suspense>
  );
}
