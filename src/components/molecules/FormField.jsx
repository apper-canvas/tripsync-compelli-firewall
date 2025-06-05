import Input from '../atoms/Input'
      import Select from '../atoms/Select'
      import Text from '../atoms/Text'

      const FormField = ({ label, id, type = 'text', value, onChange, placeholder, required = false, options, rows }) => {
        if (type === 'select') {
          return (
            <Select
              label={label}
              id={id}
              value={value}
              onChange={onChange}
              options={options}
            />
          )
        }

        if (type === 'textarea') {
          return (
            <div>
              {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
              )}
              <textarea
                id={id}
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder={placeholder}
              />
            </div>
          )
        }

        return (
          <Input
            label={label}
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
          />
        )
      }

      export default FormField