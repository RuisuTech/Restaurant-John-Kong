function LinkSpan({ onClick, children }) {
  return (
    <span
      onClick={onClick}
      className="text-green-600 cursor-pointer hover:text-green-500 dark:text-green-500 dark:hover:text-green-600 font-medium transition-colors"
    >
      {children}
    </span>
  );
}

export default LinkSpan;
