import type { ReactNode } from "react";

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
  return (
    <div
      className={`border rounded-xl p-4 flex items-center gap-5 cursor-pointer border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md hover:scale-107 transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default ZoomOnHoverCard;
