import { useState, useEffect } from 'react'
      import PlaceCard from '../molecules/PlaceCard'
      import Button from '../atoms/Button'
      import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'
      import placeService from '../../services/api/placeService'

      const PlaceList = ({ tripId }) => {
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

        if (error) {
          return <Text className="text-red-500">Error loading places: {error}</Text>
        }

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Text as="h2" className="text-2xl font-bold text-gray-900">Places to Visit</Text>
              <Button className="bg-primary text-white hover:bg-primary-dark inline-flex items-center gap-2">
                <Icon name="Plus" className="h-4 w-4" />
                Add Place
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {places.map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} />
              ))}
            </div>
          </div>
        )
      }

      export default PlaceList