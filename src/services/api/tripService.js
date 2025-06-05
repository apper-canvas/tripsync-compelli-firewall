const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let trips = []

// Load initial data
const loadTrips = async () => {
  try {
    const response = await import('../mockData/trips.json')
    trips = [...response.default]
  } catch (error) {
    console.error('Error loading trips data:', error)
    trips = []
  }
}

// Initialize data
loadTrips()

const tripService = {
  async getAll() {
    await delay(300)
    return [...trips]
  },

  async getById(id) {
    await delay(200)
    const trip = trips.find(t => t.id === id)
    return trip ? { ...trip } : null
  },

  async create(tripData) {
    await delay(400)
    const newTrip = {
      ...tripData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    trips.push(newTrip)
    return { ...newTrip }
  },

  async update(id, tripData) {
    await delay(350)
    const index = trips.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Trip not found')
    }
    trips[index] = { ...trips[index], ...tripData }
    return { ...trips[index] }
  },

  async delete(id) {
    await delay(250)
    const index = trips.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Trip not found')
    }
    const deletedTrip = trips.splice(index, 1)[0]
    return { ...deletedTrip }
  }
}

export default tripService