import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import itineraryService from '../services/api/itineraryService'
import { format, addDays } from 'date-fns'

const MainFeature = ({ tripId }) => {
  const [itineraries, setItineraries] = useState([])
  const [selectedDay, setSelectedDay] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newActivity, setNewActivity] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    category: 'attraction'
  })

  // Mock trip duration for demo
  const tripDuration = 7
  const tripStartDate = new Date('2024-06-15')

  useEffect(() => {
    const loadItineraries = async () => {
      setLoading(true)
      try {
        const result = await itineraryService.getAll()
        setItineraries(result?.filter(itinerary => itinerary.tripId === tripId) || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadItineraries()
  }, [tripId])

  const getDayItinerary = (day) => {
    return itineraries.find(itinerary => itinerary.day === day) || { activities: [] }
  }

  const handleAddActivity = async (e) => {
    e.preventDefault()
    if (!newActivity.title || !newActivity.startTime) {
      toast.error('Please fill in required fields')
      return
    }

    try {
      const activity = {
        ...newActivity,
        id: Date.now().toString(),
        day: selectedDay
      }

      // Find existing day itinerary or create new one
      let dayItinerary = itineraries.find(it => it.day === selectedDay)
      
      if (dayItinerary) {
        // Update existing itinerary
        const updatedItinerary = {
          ...dayItinerary,
          activities: [...dayItinerary.activities, activity]
        }
        await itineraryService.update(dayItinerary.id, updatedItinerary)
        setItineraries(itineraries.map(it => 
          it.id === dayItinerary.id ? updatedItinerary : it
        ))
      } else {
        // Create new itinerary for the day
        const newItinerary = {
          id: Date.now().toString(),
          tripId,
          day: selectedDay,
          date: format(addDays(tripStartDate, selectedDay - 1), 'yyyy-MM-dd'),
          activities: [activity]
        }
        await itineraryService.create(newItinerary)
        setItineraries([...itineraries, newItinerary])
      }

      setNewActivity({
        title: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        category: 'attraction'
      })
      setShowAddForm(false)
      toast.success('Activity added successfully!')
    } catch (err) {
      toast.error('Failed to add activity')
    }
  }

  const handleDeleteActivity = async (activityId) => {
    try {
      const dayItinerary = itineraries.find(it => it.day === selectedDay)
      if (!dayItinerary) return

      const updatedItinerary = {
        ...dayItinerary,
        activities: dayItinerary.activities.filter(activity => activity.id !== activityId)
      }

      await itineraryService.update(dayItinerary.id, updatedItinerary)
      setItineraries(itineraries.map(it => 
        it.id === dayItinerary.id ? updatedItinerary : it
      ))
      toast.success('Activity removed')
    } catch (err) {
      toast.error('Failed to remove activity')
    }
  }

  const categories = [
    { value: 'attraction', label: 'Attraction', icon: 'MapPin', color: 'bg-blue-100 text-blue-700' },
    { value: 'restaurant', label: 'Restaurant', icon: 'Coffee', color: 'bg-orange-100 text-orange-700' },
    { value: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: 'bg-purple-100 text-purple-700' },
    { value: 'transport', label: 'Transport', icon: 'Car', color: 'bg-green-100 text-green-700' },
    { value: 'hotel', label: 'Hotel', icon: 'Home', color: 'bg-gray-100 text-gray-700' },
    { value: 'activity', label: 'Activity', icon: 'Activity', color: 'bg-red-100 text-red-700' }
  ]

  const getCategoryInfo = (category) => {
    return categories.find(cat => cat.value === category) || categories[0]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map(day => (
            <div key={day} className="bg-gray-200 animate-pulse rounded-full px-4 py-2 min-w-[80px] h-10"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-card animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 w-12 h-12 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const currentDayItinerary = getDayItinerary(selectedDay)
  const sortedActivities = [...(currentDayItinerary.activities || [])].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  )

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Daily Itinerary</h2>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {[...Array(tripDuration)].map((_, index) => {
            const day = index + 1
            const dayDate = addDays(tripStartDate, index)
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center px-4 py-3 rounded-xl min-w-[80px] transition-all duration-200 ${
                  selectedDay === day
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-card'
                }`}
              >
                <span className="text-xs font-medium opacity-75">
                  {format(dayDate, 'EEE')}
                </span>
                <span className="text-lg font-bold">
                  {format(dayDate, 'd')}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Day Header */}
      <div className="bg-white p-6 rounded-xl shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Day {selectedDay} - {format(addDays(tripStartDate, selectedDay - 1), 'EEEE, MMMM d')}
            </h3>
            <p className="text-gray-600 mt-1">
              {sortedActivities.length} {sortedActivities.length === 1 ? 'activity' : 'activities'} planned
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            Add Activity
          </button>
        </div>
      </div>

      {/* Add Activity Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-card"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Activity</h4>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Visit Eiffel Tower"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newActivity.category}
                    onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={newActivity.startTime}
                    onChange={(e) => setNewActivity({...newActivity, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newActivity.endTime}
                    onChange={(e) => setNewActivity({...newActivity, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Champ de Mars, Paris"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Additional details about this activity..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Add Activity
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activities Timeline */}
      <div className="space-y-4">
        {sortedActivities.length > 0 ? (
          sortedActivities.map((activity, index) => {
            const categoryInfo = getCategoryInfo(activity.category)
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-card hover:shadow-soft transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  {/* Time */}
                  <div className="flex-shrink-0 text-center min-w-[80px]">
                    <div className="text-lg font-bold text-gray-900">{activity.startTime}</div>
                    {activity.endTime && (
                      <div className="text-sm text-gray-500">to {activity.endTime}</div>
                    )}
                  </div>

                  {/* Timeline Line */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${categoryInfo.color.replace('bg-', 'bg-').replace('text-', '')}`}></div>
                    {index < sortedActivities.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{activity.title}</h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                            <ApperIcon name={categoryInfo.icon} className="h-3 w-3" />
                            {categoryInfo.label}
                          </span>
                        </div>

                        {activity.location && (
                          <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                            <ApperIcon name="MapPin" className="h-4 w-4" />
                            {activity.location}
                          </p>
                        )}

                        {activity.description && (
                          <p className="text-gray-600 text-sm">{activity.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors">
                          <ApperIcon name="Edit2" className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-12 rounded-xl shadow-card text-center"
          >
            <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <ApperIcon name="Calendar" className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No activities planned</h3>
            <p className="text-gray-500 mb-6">Start planning your day by adding your first activity!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
              Add First Activity
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MainFeature