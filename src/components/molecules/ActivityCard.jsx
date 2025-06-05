import { motion } from 'framer-motion'
      import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'
      import Button from '../atoms/Button'

      const ActivityCard = ({ activity, categoryInfo, onEdit, onDelete, index }) => {
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-card hover:shadow-soft transition-shadow group"
          >
            <div className="flex items-start gap-4">
              {/* Time */}
              <div className="flex-shrink-0 text-center min-w-[80px]">
                <Text as="div" className="text-lg font-bold text-gray-900">{activity.startTime}</Text>
                {activity.endTime && (
                  <Text as="div" className="text-sm text-gray-500">to {activity.endTime}</Text>
                )}
              </div>

              {/* Timeline Line */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${categoryInfo.color.replace('bg-', 'bg-').replace('text-', '')}`}></div>
                {index < 999 && ( // Dummy condition, replace with actual logic if needed for last item
                  <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                )}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Text as="h4" className="text-lg font-semibold text-gray-900">{activity.title}</Text>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        <Icon name={categoryInfo.icon} className="h-3 w-3" />
                        {categoryInfo.label}
                      </span>
                    </div>

                    {activity.location && (
                      <Text as="p" className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                        <Icon name="MapPin" className="h-4 w-4" />
                        {activity.location}
                      </Text>
                    )}

                    {activity.description && (
                      <Text as="p" className="text-gray-600 text-sm">{activity.description}</Text>
                    )}
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={onEdit} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors">
                      <Icon name="Edit2" className="h-4 w-4" />
                    </Button>
                    <Button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors">
                      <Icon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      }

      export default ActivityCard