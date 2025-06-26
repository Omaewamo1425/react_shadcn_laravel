import React from "react";
import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white dark:bg-gray-900">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-300" />
    </div>
  );
}
