import { Suspense } from "react"
import UserProfileClient from "./profile"

export default function UserProfilePage() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <UserProfileClient />
    </Suspense>
  )
}
