import { useState, useEffect } from 'react'
      import { motion, AnimatePresence } from 'framer-motion'
      import { toast } from 'react-toastify'
      import { format, addDays } from 'date-fns'
      import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'
      import Button from '../atoms/Button'
      import FormField from '../molecules/FormField'
      import DaySelector from '../molecules/DaySelector'
      import ActivityCard from '../molecules/ActivityCard'
      import itineraryService from '../../services/api/itineraryService'

      const ItineraryTimeline = ({ tripId, tripStartDate, tripDuration }) => {
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

            let dayItinerary = itineraries.find(it => it.day === selectedDay)
            
            if (dayItinerary) {
              const updatedItinerary = {
                ...dayItinerary,
                activities: [...dayItinerary.activities, activity]
              }
              await itineraryService.update(dayItinerary.id, updatedItinerary)
              setItineraries(itineraries.map(it => 
                it.id === dayItinerary.id ? updatedItinerary : it
              ))
            } else {
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
              <Text as="h2" className="text-2xl font-bold text-gray-900">Daily Itinerary</Text>
              <DaySelector 
                tripDuration={tripDuration} 
                tripStartDate={tripStartDate} 
                selectedDay={selectedDay} 
                onSelectDay={setSelectedDay} 
              />
            </div>

            {/* Selected Day Header */}
            <div className="bg-white p-6 rounded-xl shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <Text as="h3" className="text-xl font-semibold text-gray-900">
                    Day {selectedDay} - {format(addDays(tripStartDate, selectedDay - 1), 'EEEE, MMMM d')}
                  </Text>
                  <Text as="p" className="text-gray-600 mt-1">
                    {sortedActivities.length} {sortedActivities.length === 1 ? 'activity' : 'activities'} planned
                  </Text>
                </div>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-primary text-white hover:bg-primary-dark inline-flex items-center gap-2"
                >
                  <Icon name="Plus" className="h-4 w-4" />
                  Add Activity
                </Button>
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
                  <Text as="h4" className="text-lg font-semibold text-gray-900 mb-4">Add New Activity</Text>
                  <form onSubmit={handleAddActivity} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Activity Title"
                        id="title"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                        placeholder="e.g., Visit Eiffel Tower"
                        required
                      />
                      <FormField
                        label="Category"
                        id="category"
                        type="select"
                        value={newActivity.category}
                        onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                        options={categories}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Start Time"
                        id="startTime"
                        type="time"
                        value={newActivity.startTime}
                        onChange={(e) => setNewActivity({...newActivity, startTime: e.target.value})}
                        required
                      />
                      <FormField
                        label="End Time"
                        id="endTime"
                        type="time"
                        value={newActivity.endTime}
                        onChange={(e) => setNewActivity({...newActivity, endTime: e.target.value})}
                      />
                    </div>

                    <FormField
                      label="Location"
                      id="location"
                      value={newActivity.location}
                      onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                      placeholder="e.g., Champ de Mars, Paris"
                    />

                    <FormField
                      label="Description"
                      id="description"
                      type="textarea"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                      rows={3}
                      placeholder="Additional details about this activity..."
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        className="bg-primary text-white hover:bg-primary-dark"
                      >
                        Add Activity
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Cancel
                      </Button>
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
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      categoryInfo={categoryInfo}
                      onEdit={() => { /* Implement edit logic */ }}
                      onDelete={() => handleDeleteActivity(activity.id)}
                      index={index}
                    />
                  )
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-12 rounded-xl shadow-card text-center"
                >
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Icon name="Calendar" className="h-8 w-8 text-gray-400" />
                  </div>
                  <Text as="h3" className="text-xl font-semibold text-gray-900 mb-3">No activities planned</Text>
                  <Text as="p" className="text-gray-500 mb-6">Start planning your day by adding your first activity!</Text>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-primary text-white hover:bg-primary-dark inline-flex items-center gap-2"
                  >
                    <Icon name="Plus" className="h-4 w-4" />
                    Add First Activity
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        )
      }

      export default ItineraryTimeline