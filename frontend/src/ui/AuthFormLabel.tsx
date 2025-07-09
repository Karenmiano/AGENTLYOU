interface AuthFormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

function AuthFormLabel({ htmlFor, children }: AuthFormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium sm:text-base"
    >
      {children}
    </label>
  );
}

export default AuthFormLabel;
