import { motion } from 'framer-motion'
      import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'

      const HeroSection = ({ trip }) => {
        const daysToGo = Math.ceil((new Date(trip.endDate) - new Date()) / (1000 * 60 * 60 * 24))
        const tripDuration = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))

        return (
          <motion.div 
            className="relative h-64 md:h-80 bg-gradient-to-r from-primary to-secondary overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0">
              <img 
                src={trip.coverImage} 
                alt={trip.destination}
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
                  <Text as="h1" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{trip.name}</Text>
                  <Text as="p" className="text-lg md:text-xl text-white/90 mb-4">{trip.destination}</Text>
                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" className="h-4 w-4" />
                      <Text as="span">{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" className="h-4 w-4" />
                      <Text as="span">{daysToGo} days to go</Text>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )
      }

      export default HeroSection