import { motion } from 'framer-motion'
      import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'
      import Button from '../atoms/Button'

      const PlaceCard = ({ place, index }) => {
        return (
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
                <Text as="h3" className="text-lg font-semibold text-gray-900 line-clamp-1">{place.name}</Text>
                {place.mustSee && (
                  <div className="bg-accent text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Icon name="Star" className="h-3 w-3" />
                    Must-see
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">{place.category}</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon 
                      key={i} 
                      name="Star" 
                      className={`h-3 w-3 ${i < place.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <Text as="span" className="text-xs text-gray-500 ml-1">{place.rating}</Text>
                </div>
              </div>
              
              <Text as="p" className="text-gray-600 text-sm mb-4 line-clamp-2">{place.description}</Text>
              
              <Button className="w-full bg-gray-50 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm">
                Add to Itinerary
              </Button>
            </div>
          </motion.div>
        )
      }

      export default PlaceCard