import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ZoomOnHoverCardProps {
  className: string;
  onClick: () => void;
  children: ReactNode;
}

function ZoomOnHoverCard({
  className = "",
  onClick = () => {},
  children,
}: ZoomOnHoverCardProps) {
  const classes = twMerge(
    `border rounded-xl p-4 flex items-center gap-5 cursor-pointer shadow-sm border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-107 transition-all ${className}`
  );
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}

export default ZoomOnHoverCard;
