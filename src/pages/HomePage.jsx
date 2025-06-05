import { useState, useEffect } from 'react'
      import { AnimatePresence } from 'framer-motion'
      import DefaultPageLayout from '../components/templates/DefaultPageLayout'
      import TripDetailPageLayout from '../components/templates/TripDetailPageLayout'
      import Icon from '../components/atoms/Icon'
      import Text from '../components/atoms/Text'
      import OverviewSection from '../components/organisms/OverviewSection'
      import QuickActions from '../components/organisms/QuickActions'
      import ItineraryTimeline from '../components/organisms/ItineraryTimeline'
      import AccommodationList from '../components/organisms/AccommodationList'
      import PlaceList from '../components/organisms/PlaceList'
      import tripService from '../services/api/tripService'

      const HomePage = () => {
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

        if (loading || error || !currentTrip) {
          return (
            <DefaultPageLayout 
              loading={loading}
              error={error}
              iconName="Plane"
              title="Welcome to TripSync!"
              description="Start planning your next adventure with your group."
              buttonLabel="Create Your First Trip"
              onButtonClick={() => console.log('Create Trip clicked')}
            />
          )
        }

        const tripDuration = Math.ceil((new Date(currentTrip.endDate) - new Date(currentTrip.startDate)) / (1000 * 60 * 60 * 24)) + 1
        const tripStartDate = new Date(currentTrip.startDate)

        return (
          <TripDetailPageLayout
            trip={currentTrip}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <>
                  <OverviewSection trip={currentTrip} />
                  <QuickActions />
                </>
              )}

              {activeTab === 'itinerary' && (
                <ItineraryTimeline 
                  tripId={currentTrip.id} 
                  tripStartDate={tripStartDate}
                  tripDuration={tripDuration}
                />
              )}

              {activeTab === 'accommodation' && (
                <AccommodationList tripId={currentTrip.id} />
              )}

              {activeTab === 'places' && (
                <PlaceList tripId={currentTrip.id} />
              )}

              {(activeTab === 'map' || activeTab === 'expenses') && (
                <div className="bg-white p-12 rounded-xl shadow-card text-center">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Icon name={activeTab === 'map' ? 'Map' : 'DollarSign'} className="h-8 w-8 text-gray-400" />
                  </div>
                  <Text as="h3" className="text-xl font-semibold text-gray-900 mb-3">
                    {activeTab === 'map' ? 'Interactive Map Coming Soon' : 'Expense Tracking Coming Soon'}
                  </Text>
                  <Text as="p" className="text-gray-500">
                    {activeTab === 'map' 
                      ? "See all your trip locations in one beautiful interactive map view!"
                      : "Split expenses fairly and track group spending with ease!"
                    }
                  </Text>
                </div>
              )}
            </AnimatePresence>
          </TripDetailPageLayout>
        )
      }

      export default HomePage