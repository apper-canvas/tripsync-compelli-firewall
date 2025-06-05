const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let places = []

// Load initial data
const loadPlaces = async () => {
  try {
    const response = await import('../mockData/places.json')
    places = [...response.default]
  } catch (error) {
    console.error('Error loading places data:', error)
    places = []
  }
}

// Initialize data
loadPlaces()

const placeService = {
  async getAll() {
    await delay(300)
    return [...places]
  },

  async getById(id) {
    await delay(200)
    const place = places.find(p => p.id === id)
    return place ? { ...place } : null
  },

  async getByTripId(tripId) {
    await delay(250)
    return places.filter(p => p.tripId === tripId).map(p => ({ ...p }))
  },

  async create(placeData) {
    await delay(400)
    const newPlace = {
      ...placeData,
      id: Date.now().toString()
    }
    places.push(newPlace)
    return { ...newPlace }
  },

  async update(id, placeData) {
    await delay(350)
    const index = places.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Place not found')
    }
    places[index] = { ...places[index], ...placeData }
    return { ...places[index] }
  },

  async delete(id) {
    await delay(250)
    const index = places.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Place not found')
    }
    const deletedPlace = places.splice(index, 1)[0]
    return { ...deletedPlace }
  }
}

export default placeService