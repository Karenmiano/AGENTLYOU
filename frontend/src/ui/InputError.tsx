function InputError({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-red-500 mt-1 text-sm sm:text-base text">{children}</p>
  );
}

export default InputError;
