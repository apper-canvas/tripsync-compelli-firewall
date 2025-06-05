const Select = ({ label, id, value, onChange, options, className = '' }) => {
        return (
          <div>
            {label && (
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
            )}
            <select
              id={id}
              value={value}
              onChange={onChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )
      }

      export default Select