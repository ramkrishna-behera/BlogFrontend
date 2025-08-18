import * as React from "react";
import { cn } from "../../lib/utils";

export const Label = React.forwardRef(({ className, htmlFor, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-gray-700 mb-1",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
});
Label.displayName = "Label";
