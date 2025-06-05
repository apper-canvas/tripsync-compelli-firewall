const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let members = []
let invitations = []

// Load initial data
const loadData = async () => {
  try {
    const membersResponse = await import('../mockData/members.json')
    const invitationsResponse = await import('../mockData/invitations.json')
    members = [...membersResponse.default]
    invitations = [...invitationsResponse.default]
  } catch (error) {
    console.error('Error loading invite data:', error)
    members = []
    invitations = []
  }
}

// Initialize data
loadData()

const inviteService = {
  // Members CRUD operations
  async getAllMembers(tripId) {
    await delay(250)
    return members.filter(member => member.tripId === tripId).map(member => ({ ...member }))
  },

  async getMemberById(id) {
    await delay(200)
    const member = members.find(m => m.id === id)
    return member ? { ...member } : null
  },

  async addMember(memberData) {
    await delay(300)
    const newMember = {
      ...memberData,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString(),
      status: 'active'
    }
    members.push(newMember)
    return { ...newMember }
  },

  async updateMember(id, memberData) {
    await delay(250)
    const index = members.findIndex(m => m.id === id)
    if (index === -1) {
      throw new Error('Member not found')
    }
    members[index] = { ...members[index], ...memberData }
    return { ...members[index] }
  },

  async removeMember(id) {
    await delay(300)
    const index = members.findIndex(m => m.id === id)
    if (index === -1) {
      throw new Error('Member not found')
    }
    const removedMember = members.splice(index, 1)[0]
    return { ...removedMember }
  },

  // Invitations CRUD operations
  async getAllInvitations(tripId) {
    await delay(200)
    return invitations.filter(inv => inv.tripId === tripId).map(inv => ({ ...inv }))
  },

  async sendInvite(inviteData) {
    await delay(400)
    const newInvitation = {
      ...inviteData,
      id: Date.now().toString(),
      sentAt: new Date().toISOString(),
      status: 'pending'
    }
    invitations.push(newInvitation)
    return { ...newInvitation }
  },

  async acceptInvite(inviteId) {
    await delay(350)
    const index = invitations.findIndex(inv => inv.id === inviteId)
    if (index === -1) {
      throw new Error('Invitation not found')
    }
    invitations[index].status = 'accepted'
    invitations[index].acceptedAt = new Date().toISOString()
    
    // Add member to trip
    const invitation = invitations[index]
    const newMember = {
      id: Date.now().toString(),
      tripId: invitation.tripId,
      name: invitation.inviteeName,
      email: invitation.inviteeEmail,
      role: invitation.role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(invitation.inviteeName)}&background=5B5FDE&color=fff`,
      joinedAt: new Date().toISOString(),
      status: 'active'
    }
    members.push(newMember)
    
    return { invitation: { ...invitations[index] }, member: { ...newMember } }
  },

  async declineInvite(inviteId) {
    await delay(250)
    const index = invitations.findIndex(inv => inv.id === inviteId)
    if (index === -1) {
      throw new Error('Invitation not found')
    }
    invitations[index].status = 'declined'
    invitations[index].declinedAt = new Date().toISOString()
    return { ...invitations[index] }
  },

  async deleteInvitation(id) {
    await delay(200)
    const index = invitations.findIndex(inv => inv.id === id)
    if (index === -1) {
      throw new Error('Invitation not found')
    }
    const deletedInvite = invitations.splice(index, 1)[0]
    return { ...deletedInvite }
  }
}

export default inviteService