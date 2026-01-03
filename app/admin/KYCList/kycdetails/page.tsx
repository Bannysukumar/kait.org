import { Suspense } from "react";
import KYCDetails from "./kycdetails";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading KYC details...</div>}>
      <KYCDetails />
    </Suspense>
  );
}
