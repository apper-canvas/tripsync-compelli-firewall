const Button = ({ children, onClick, className = '', disabled = false, type = 'button' }) => {
        const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors"
        const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : ""

        return (
          <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${className} ${disabledStyles}`}
            disabled={disabled}
          >
            {children}
          </button>
        )
      }

      export default Button