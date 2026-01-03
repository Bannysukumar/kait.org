import { Suspense } from "react"
import UserDetailsClient from "./userlist"

export default function UserDetailsPage() {
  return (
    <Suspense fallback={<div>Loading user details...</div>}>
      <UserDetailsClient />
    </Suspense>
  )
}
