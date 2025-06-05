import Button from '../atoms/Button'
      import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'

      const ActionButton = ({ iconName, label, onClick, className = 'bg-gray-50 text-gray-700 hover:bg-gray-100' }) => {
        return (
          <Button onClick={onClick} className={`w-full flex items-center gap-3 p-3 text-left ${className}`}>
            <Icon name={iconName} className="h-4 w-4" />
            <Text as="span" className="text-sm font-medium">{label}</Text>
          </Button>
        )
      }

      export default ActionButton