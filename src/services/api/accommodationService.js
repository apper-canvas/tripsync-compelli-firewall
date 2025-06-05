const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let accommodations = []

// Load initial data
const loadAccommodations = async () => {
  try {
    const response = await import('../mockData/accommodations.json')
    accommodations = [...response.default]
  } catch (error) {
    console.error('Error loading accommodations data:', error)
    accommodations = []
  }
}

// Initialize data
loadAccommodations()

const accommodationService = {
  async getAll() {
    await delay(300)
    return [...accommodations]
  },

  async getById(id) {
    await delay(200)
    const accommodation = accommodations.find(a => a.id === id)
    return accommodation ? { ...accommodation } : null
  },

  async getByTripId(tripId) {
    await delay(250)
    return accommodations.filter(a => a.tripId === tripId).map(a => ({ ...a }))
  },

  async create(accommodationData) {
    await delay(400)
    const newAccommodation = {
      ...accommodationData,
      id: Date.now().toString()
    }
    accommodations.push(newAccommodation)
    return { ...newAccommodation }
  },

  async update(id, accommodationData) {
    await delay(350)
    const index = accommodations.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Accommodation not found')
    }
    accommodations[index] = { ...accommodations[index], ...accommodationData }
    return { ...accommodations[index] }
  },

  async delete(id) {
    await delay(250)
    const index = accommodations.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Accommodation not found')
    }
    const deletedAccommodation = accommodations.splice(index, 1)[0]
    return { ...deletedAccommodation }
  }
}

export default accommodationService