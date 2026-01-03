import { Suspense } from "react"
import KycDetailsClient from "./kycapplication"

export default function KycDetailsPage() {
  return (
    <Suspense fallback={<div>Loading KYC details...</div>}>
      <KycDetailsClient />
    </Suspense>
  )
}
