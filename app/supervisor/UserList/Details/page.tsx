// app/admin/UserList/Details/page.tsx
import { Suspense } from "react";
import InvestorDetailsPage from "./userdetails"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading user details...</div>}>
      <InvestorDetailsPage params={{
              id: ""
          }}/>
    </Suspense>
  );
}
