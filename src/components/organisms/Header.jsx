import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'
      import Button from '../atoms/Button'

      const Header = () => {
        return (
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary text-white p-2 rounded-xl">
                    <Icon name="Plane" className="h-6 w-6" />
                  </div>
                  <div>
                    <Text as="h1" className="text-xl font-bold text-gray-900">TripSync</Text>
                    <Text as="p" className="text-sm text-gray-500 hidden sm:block">Group Travel Planning</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <Icon name="Bell" className="h-5 w-5" />
                  </Button>
                  <Button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <Icon name="Settings" className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </header>
        )
      }

      export default Header