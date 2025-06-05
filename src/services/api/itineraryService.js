const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let itineraries = []

// Load initial data
const loadItineraries = async () => {
  try {
    const response = await import('../mockData/itineraries.json')
    itineraries = [...response.default]
  } catch (error) {
    console.error('Error loading itineraries data:', error)
    itineraries = []
  }
}

// Initialize data
loadItineraries()

const itineraryService = {
  async getAll() {
    await delay(300)
    return [...itineraries]
  },

  async getById(id) {
    await delay(200)
    const itinerary = itineraries.find(i => i.id === id)
    return itinerary ? { ...itinerary } : null
  },

  async getByTripId(tripId) {
    await delay(250)
    return itineraries.filter(i => i.tripId === tripId).map(i => ({ ...i }))
  },

  async create(itineraryData) {
    await delay(400)
    const newItinerary = {
      ...itineraryData,
      id: Date.now().toString()
    }
    itineraries.push(newItinerary)
    return { ...newItinerary }
  },

  async update(id, itineraryData) {
    await delay(350)
    const index = itineraries.findIndex(i => i.id === id)
    if (index === -1) {
      throw new Error('Itinerary not found')
    }
    itineraries[index] = { ...itineraries[index], ...itineraryData }
    return { ...itineraries[index] }
  },

  async delete(id) {
    await delay(250)
    const index = itineraries.findIndex(i => i.id === id)
    if (index === -1) {
      throw new Error('Itinerary not found')
    }
    const deletedItinerary = itineraries.splice(index, 1)[0]
    return { ...deletedItinerary }
  }
}

export default itineraryService