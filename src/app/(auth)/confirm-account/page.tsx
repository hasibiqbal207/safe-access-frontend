import React, { Suspense } from "react";
import ConfirmAccount from "./confirm-account";

const Page = () => {
  return (
    <Suspense>
      <ConfirmAccount />
    </Suspense>
  );
};

export default Page;