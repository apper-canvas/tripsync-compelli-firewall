import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'
      import Button from '../atoms/Button'

      const DefaultPageLayout = ({ title, iconName, description, buttonLabel, onButtonClick, loading, error, children }) => {
        if (loading) {
          return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <Text as="p" className="text-gray-600">Loading your trips...</Text>
              </div>
            </div>
          )
        }

        if (error) {
          return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
              <div className="text-center bg-white p-8 rounded-2xl shadow-soft max-w-md">
                <Icon name="AlertTriangle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <Text as="h2" className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</Text>
                <Text as="p" className="text-gray-600">{error}</Text>
              </div>
            </div>
          )
        }

        if (children) {
          return children
        }

        return (
          <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
            <div className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-soft max-w-md">
              <Icon name={iconName} className="h-16 w-16 text-primary mx-auto mb-6" />
              <Text as="h2" className="text-2xl font-bold text-gray-900 mb-4">{title}</Text>
              <Text as="p" className="text-gray-600 mb-6">{description}</Text>
              <Button onClick={onButtonClick} className="bg-primary text-white hover:bg-primary-dark">
                {buttonLabel}
              </Button>
            </div>
          </div>
        )
      }

      export default DefaultPageLayout