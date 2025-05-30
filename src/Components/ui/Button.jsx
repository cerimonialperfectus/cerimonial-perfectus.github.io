export function Button({ children, className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-primary-dark transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
