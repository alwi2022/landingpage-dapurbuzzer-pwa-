import { Suspense } from "react";
import InfluencersClient from "./InfluencersClient";

export const dynamic = "force-dynamic"; // hindari prerender error
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <InfluencersClient />
    </Suspense>
  );
}
