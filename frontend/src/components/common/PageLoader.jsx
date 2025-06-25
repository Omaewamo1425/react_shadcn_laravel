import React from "react";
import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[60vh] w-full">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
    </div>
  );
}
