import { useState, useEffect } from 'react'
      import AccommodationCard from '../molecules/AccommodationCard'
      import Button from '../atoms/Button'
      import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'
      import accommodationService from '../../services/api/accommodationService'

      const AccommodationList = ({ tripId }) => {
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

        if (error) {
          return <Text className="text-red-500">Error loading accommodations: {error}</Text>
        }

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Text as="h2" className="text-2xl font-bold text-gray-900">Accommodations</Text>
              <Button className="bg-primary text-white hover:bg-primary-dark inline-flex items-center gap-2">
                <Icon name="Plus" className="h-4 w-4" />
                Add Accommodation
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodations.map((accommodation, index) => (
                <AccommodationCard key={accommodation.id} accommodation={accommodation} index={index} />
              ))}
            </div>
          </div>
        )
      }

      export default AccommodationList