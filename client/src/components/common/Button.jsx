const styles = {
  primary: 'bg-sea text-white hover:bg-teal-700',
  secondary: 'bg-white text-ink border border-teal-200 hover:border-teal-400',
  danger: 'bg-rose-600 text-white hover:bg-rose-700'
};

const Button = ({
  type = 'button',
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
