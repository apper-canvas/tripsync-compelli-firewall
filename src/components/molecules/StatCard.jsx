import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'

      const StatCard = ({ iconName, iconColor, value, label }) => {
        return (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-card">
            <div className="flex items-center gap-3">
              <div className={`${iconColor}/10 p-2 rounded-lg`}>
                <Icon name={iconName} className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <Text as="p" className="text-2xl font-bold text-gray-900">{value}</Text>
                <Text as="p" className="text-sm text-gray-500">{label}</Text>
              </div>
            </div>
          </div>
        )
      }

      export default StatCard