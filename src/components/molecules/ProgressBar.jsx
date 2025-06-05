import Text from '../atoms/Text'

      const ProgressBar = ({ label, value, max = 100, className = '' }) => {
        const percentage = Math.min(Math.max(0, (value / max) * 100), 100)
        return (
          <div className={className}>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Text as="span" className="text-sm font-medium text-gray-700">{label}</Text>
              <Text as="span" className="text-sm text-gray-500">{percentage}%</Text>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        )
      }

      export default ProgressBar