import { motion } from 'framer-motion'
      import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'

      const AccommodationCard = ({ accommodation, index }) => {
        return (
          <motion.div
            key={accommodation.id}
            className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-soft transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Icon name="Home" className="h-12 w-12 text-gray-400" />
            </div>
            <div className="p-6">
              <Text as="h3" className="text-lg font-semibold text-gray-900 mb-2">{accommodation.name}</Text>
              <Text as="p" className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                <Icon name="MapPin" className="h-4 w-4" />
                {accommodation.address}
              </Text>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Text as="span" className="text-gray-500">Check-in</Text>
                  <Text as="span" className="font-medium">{new Date(accommodation.checkIn).toLocaleDateString()}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text as="span" className="text-gray-500">Check-out</Text>
                  <Text as="span" className="font-medium">{new Date(accommodation.checkOut).toLocaleDateString()}</Text>
                </div>
                {accommodation.confirmationNumber && (
                  <div className="flex items-center justify-between text-sm">
                    <Text as="span" className="text-gray-500">Confirmation</Text>
                    <Text as="span" className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{accommodation.confirmationNumber}</Text>
                  </div>
                )}
              </div>

              {accommodation.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <Text as="p" className="text-sm text-gray-600">{accommodation.notes}</Text>
                </div>
              )}
            </div>
          </motion.div>
        )
      }

      export default AccommodationCard