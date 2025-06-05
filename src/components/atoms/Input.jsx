const Input = ({ label, id, type = 'text', value, onChange, placeholder, required = false, className = '' }) => {
        return (
          <div>
            {label && (
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && '*'}
              </label>
            )}
            <input
              id={id}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            />
          </div>
        )
      }

      export default Input