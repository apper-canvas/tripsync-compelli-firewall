import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import tripService from '../services/api/tripService'
import accommodationService from '../services/api/accommodationService'
import placeService from '../services/api/placeService'
import itineraryService from '../services/api/itineraryService'

const Home = () => {
  const [trips, setTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true)
      try {
        const result = await tripService.getAll()
        setTrips(result || [])
        if (result?.length > 0) {
          setCurrentTrip(result[0])
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTrips()
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'MapPin' },
    { id: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
    { id: 'accommodation', label: 'Accommodation', icon: 'Home' },
    { id: 'places', label: 'Places', icon: 'Star' },
    { id: 'map', label: 'Map', icon: 'Map', disabled: true },
    { id: 'expenses', label: 'Expenses', icon: 'DollarSign', disabled: true }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-soft max-w-md">
          <ApperIcon name="AlertTriangle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-soft max-w-md">
          <ApperIcon name="Plane" className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to TripSync!</h2>
          <p className="text-gray-600 mb-6">Start planning your next adventure with your group.</p>
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors">
            Create Your First Trip
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-white p-2 rounded-xl">
                <ApperIcon name="Plane" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TripSync</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Group Travel Planning</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <ApperIcon name="Bell" className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <ApperIcon name="Settings" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Trip Hero Section */}
      <motion.div 
        className="relative h-64 md:h-80 bg-gradient-to-r from-primary to-secondary overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0">
          <img 
            src={currentTrip.coverImage} 
            alt={currentTrip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <motion.div 
              className="text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{currentTrip.name}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-4">{currentTrip.destination}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" className="h-4 w-4" />
                  <span>{new Date(currentTrip.startDate).toLocaleDateString()} - {new Date(currentTrip.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Clock" className="h-4 w-4" />
                  <span>{Math.ceil((new Date(currentTrip.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days to go</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : tab.disabled
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={tab.disabled}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-card">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <ApperIcon name="Calendar" className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {Math.ceil((new Date(currentTrip.endDate) - new Date(currentTrip.startDate)) / (1000 * 60 * 60 * 24))}
                          </p>
                          <p className="text-sm text-gray-500">Days</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-card">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-2 rounded-lg">
                          <ApperIcon name="MapPin" className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">12</p>
                          <p className="text-sm text-gray-500">Activities</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-card">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent/10 p-2 rounded-lg">
                          <ApperIcon name="Home" className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">3</p>
                          <p className="text-sm text-gray-500">Hotels</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-card">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <ApperIcon name="Star" className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">8</p>
                          <p className="text-sm text-gray-500">Must-See</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Description */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Overview</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">{currentTrip.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Planning Progress</span>
                      <span className="text-sm text-gray-500">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 text-left bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                      <ApperIcon name="Plus" className="h-4 w-4" />
                      <span className="text-sm font-medium">Add Activity</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      <ApperIcon name="Share" className="h-4 w-4" />
                      <span className="text-sm font-medium">Invite Travelers</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      <ApperIcon name="Download" className="h-4 w-4" />
                      <span className="text-sm font-medium">Export Itinerary</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <MainFeature tripId={currentTrip.id} />
            )}

            {activeTab === 'accommodation' && (
              <AccommodationTab tripId={currentTrip.id} />
            )}

            {activeTab === 'places' && (
              <PlacesTab tripId={currentTrip.id} />
            )}

            {(activeTab === 'map' || activeTab === 'expenses') && (
              <div className="bg-white p-12 rounded-xl shadow-card text-center">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <ApperIcon name={activeTab === 'map' ? 'Map' : 'DollarSign'} className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {activeTab === 'map' ? 'Interactive Map Coming Soon' : 'Expense Tracking Coming Soon'}
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === 'map' 
                      ? "See all your trip locations in one beautiful interactive map view!"
                      : "Split expenses fairly and track group spending with ease!"
                    }
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

// Accommodation Tab Component
const AccommodationTab = ({ tripId }) => {
  const [accommodations, setAccommodations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAccommodations = async () => {
      setLoading(true)
      try {
        const result = await accommodationService.getAll()
        setAccommodations(result?.filter(acc => acc.tripId === tripId) || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadAccommodations()
  }, [tripId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-card animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Accommodations</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Accommodation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accommodations.map((accommodation, index) => (
          <motion.div
            key={accommodation.id}
            className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-soft transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <ApperIcon name="Home" className="h-12 w-12 text-gray-400" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{accommodation.name}</h3>
              <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                <ApperIcon name="MapPin" className="h-4 w-4" />
                {accommodation.address}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Check-in</span>
                  <span className="font-medium">{new Date(accommodation.checkIn).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Check-out</span>
                  <span className="font-medium">{new Date(accommodation.checkOut).toLocaleDateString()}</span>
                </div>
                {accommodation.confirmationNumber && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Confirmation</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{accommodation.confirmationNumber}</span>
                  </div>
                )}
              </div>

              {accommodation.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{accommodation.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Places Tab Component
const PlacesTab = ({ tripId }) => {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true)
      try {
        const result = await placeService.getAll()
        setPlaces(result?.filter(place => place.tripId === tripId) || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadPlaces()
  }, [tripId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-card overflow-hidden animate-pulse">
            <div className="aspect-[3/2] bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Places to Visit</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Place
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {places.map((place, index) => (
          <motion.div
            key={place.id}
            className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-soft transition-shadow group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="aspect-[3/2] overflow-hidden">
              <img 
                src={place.imageUrl} 
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{place.name}</h3>
                {place.mustSee && (
                  <div className="bg-accent text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <ApperIcon name="Star" className="h-3 w-3" />
                    Must-see
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">{place.category}</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon 
                      key={i} 
                      name="Star" 
                      className={`h-3 w-3 ${i < place.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{place.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{place.description}</p>
              
              <button className="w-full bg-gray-50 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm">
                Add to Itinerary
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Home