import type { ReactNode } from "react";

interface ButtonProps {
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
}

function Button({
  className = "",
  onClick = () => {},
  type = "button",
  disabled = false,
  children,
}: ButtonProps) {
  return (
    <button
      className={`rounded-full text-white bg-indigo-700 hover:bg-indigo-800 px-5 py-2.5 text-center font-medium text-sm disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-300 ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
