import ActionButton from '../molecules/ActionButton'
      import Text from '../atoms/Text'
      import Button from '../atoms/Button'

      const QuickActions = () => {
        return (
          <div className="bg-white p-6 rounded-xl shadow-card">
            <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
            <div className="space-y-3">
              <ActionButton iconName="Plus" label="Add Activity" className="bg-primary text-white hover:bg-primary-dark" />
              <ActionButton iconName="Share" label="Invite Travelers" />
              <ActionButton iconName="Download" label="Export Itinerary" />
            </div>
          </div>
        )
      }

      export default QuickActions