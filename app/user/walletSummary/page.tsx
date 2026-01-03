import { Suspense } from "react";
import WalletSummary from "./walletsummary"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading wallet summary...</div>}>
      <WalletSummary />
    </Suspense>
  );
}
