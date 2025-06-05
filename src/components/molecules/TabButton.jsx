import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'

      const TabButton = ({ label, icon, onClick, isActive, disabled }) => {
        return (
          <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
              isActive
                ? 'border-primary text-primary bg-primary/5'
                : disabled
                ? 'border-transparent text-gray-400 cursor-not-allowed'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            disabled={disabled}
          >
            <Icon name={icon} className="h-4 w-4" />
            <Text as="span" className="hidden sm:inline">{label}</Text>
          </button>
        )
      }

      export default TabButton