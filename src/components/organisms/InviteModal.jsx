import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Icon from '../atoms/Icon'
import Text from '../atoms/Text'
import Button from '../atoms/Button'
import FormField from '../molecules/FormField'
import inviteService from '../../services/api/inviteService'

const InviteModal = ({ isOpen, onClose, tripId }) => {
  const [activeTab, setActiveTab] = useState('invite')
  const [members, setMembers] = useState([])
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
    message: ''
  })

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, tripId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [membersData, invitationsData] = await Promise.all([
        inviteService.getAllMembers(tripId),
        inviteService.getAllInvitations(tripId)
      ])
      setMembers(membersData || [])
      setInvitations(invitationsData || [])
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSendInvite = async (e) => {
    e.preventDefault()
    
    if (!formData.email.trim()) {
      toast.warning('Please enter an email address')
      return
    }

    if (!formData.email.includes('@')) {
      toast.warning('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const inviteData = {
        tripId,
        inviterName: 'Current User', // This would come from auth context in real app
        inviterEmail: 'currentuser@email.com', // This would come from auth context
        inviteeName: formData.email.split('@')[0].replace(/[._]/g, ' '),
        inviteeEmail: formData.email,
        role: formData.role,
        message: formData.message || `You've been invited to join our trip!`
      }

      await inviteService.sendInvite(inviteData)
      toast.success(`Invitation sent to ${formData.email}`)
      
      setFormData({ email: '', role: 'member', message: '' })
      loadData() // Refresh data
      
    } catch (error) {
      toast.error('Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return
    }

    try {
      await inviteService.removeMember(memberId)
      toast.success('Member removed successfully')
      loadData()
    } catch (error) {
      toast.error('Failed to remove member')
    }
  }

  const handleCancelInvitation = async (invitationId) => {
    try {
      await inviteService.deleteInvitation(invitationId)
      toast.success('Invitation cancelled')
      loadData()
    } catch (error) {
      toast.error('Failed to cancel invitation')
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'organizer': return 'bg-primary text-white'
      case 'member': return 'bg-secondary text-white'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary text-white p-6 flex items-center justify-between">
            <div>
              <Text as="h2" className="text-xl font-semibold">Manage Trip Members</Text>
              <Text as="p" className="text-primary-light mt-1">
                Invite people and manage who's joining your trip
              </Text>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-primary-light transition-colors"
            >
              <Icon name="X" className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('invite')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'invite'
                    ? 'border-primary text-primary bg-primary bg-opacity-5'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon name="UserPlus" className="h-4 w-4 inline mr-2" />
                Send Invites
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'members'
                    ? 'border-primary text-primary bg-primary bg-opacity-5'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon name="Users" className="h-4 w-4 inline mr-2" />
                Members ({members.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'pending'
                    ? 'border-primary text-primary bg-primary bg-opacity-5'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon name="Clock" className="h-4 w-4 inline mr-2" />
                Pending ({invitations.filter(inv => inv.status === 'pending').length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <Text className="ml-3 text-gray-500">Loading...</Text>
              </div>
            )}

            {/* Send Invites Tab */}
            {activeTab === 'invite' && !loading && (
              <form onSubmit={handleSendInvite} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                  <FormField
                    label="Role"
                    id="role"
                    name="role"
                    type="select"
                    value={formData.role}
                    onChange={handleInputChange}
                    options={[
                      { value: 'member', label: 'Member' },
                      { value: 'organizer', label: 'Organizer' }
                    ]}
                  />
                </div>

                <FormField
                  label="Personal Message (Optional)"
                  id="message"
                  name="message"
                  type="textarea"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Add a personal note to your invitation..."
                  rows={3}
                />

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.email.trim()}
                    className="px-6 py-2 bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </form>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && !loading && (
              <div className="space-y-4">
                {members.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Text className="text-gray-500">No members found</Text>
                  </div>
                ) : (
                  members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <Text as="h4" className="font-medium text-gray-900">{member.name}</Text>
                          <Text className="text-sm text-gray-500">{member.email}</Text>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                      </div>
                      {member.role !== 'organizer' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Remove member"
                        >
                          <Icon name="UserMinus" className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Invitations Tab */}
            {activeTab === 'pending' && !loading && (
              <div className="space-y-4">
                {invitations.filter(inv => inv.status === 'pending').length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Clock" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Text className="text-gray-500">No pending invitations</Text>
                  </div>
                ) : (
                  invitations
                    .filter(inv => inv.status === 'pending')
                    .map((invitation) => (
                      <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Text as="h4" className="font-medium text-gray-900">{invitation.inviteeName}</Text>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                              {invitation.status}
                            </span>
                          </div>
                          <Text className="text-sm text-gray-500 mb-1">{invitation.inviteeEmail}</Text>
                          <Text className="text-xs text-gray-400">
                            Sent on {new Date(invitation.sentAt).toLocaleDateString()}
                          </Text>
                          {invitation.message && (
                            <Text className="text-sm text-gray-600 mt-2 italic">"{invitation.message}"</Text>
                          )}
                        </div>
                        <button
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="text-red-600 hover:text-red-800 p-2 ml-4"
                          title="Cancel invitation"
                        >
                          <Icon name="X" className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default InviteModal