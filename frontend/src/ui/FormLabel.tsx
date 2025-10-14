interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

function FormLabel({ htmlFor, children }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium sm:text-base"
    >
      {children}
    </label>
  );
}

export default FormLabel;
