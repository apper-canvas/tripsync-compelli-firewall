import { useState } from 'react'
import ActionButton from '../molecules/ActionButton'
import Text from '../atoms/Text'
import Button from '../atoms/Button'
import InviteModal from './InviteModal'

const QuickActions = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  const handleInviteClick = () => {
    setIsInviteModalOpen(true)
  }

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false)
  }

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-card">
        <Text as="h3" className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
        <div className="space-y-3">
          <ActionButton iconName="Plus" label="Add Activity" className="bg-primary text-white hover:bg-primary-dark" />
          <ActionButton iconName="Share" label="Invite Travelers" onClick={handleInviteClick} />
          <ActionButton iconName="Download" label="Export Itinerary" />
        </div>
      </div>

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        tripId="1"
      />
    </>
)
}

export default QuickActions