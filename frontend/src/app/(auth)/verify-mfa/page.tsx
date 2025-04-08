import { Suspense } from "react";
import VerifyMfa from "./verify-mfa";

const Page = () => {
  return (
    <Suspense>
      <VerifyMfa />;
    </Suspense>
  );
};

export default Page;
