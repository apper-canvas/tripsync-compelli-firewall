import { format, addDays } from 'date-fns'
      import Button from '../atoms/Button'
      import Text from '../atoms/Text'

      const DaySelector = ({ tripDuration, tripStartDate, selectedDay, onSelectDay }) => {
        return (
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {[...Array(tripDuration)].map((_, index) => {
              const day = index + 1
              const dayDate = addDays(tripStartDate, index)
              return (
                <Button
                  key={day}
                  onClick={() => onSelectDay(day)}
                  className={`flex flex-col items-center px-4 py-3 min-w-[80px] transition-all duration-200 ${
                    selectedDay === day
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-card'
                  }`}
                >
                  <Text as="span" className="text-xs font-medium opacity-75">
                    {format(dayDate, 'EEE')}
                  </Text>
                  <Text as="span" className="text-lg font-bold">
                    {format(dayDate, 'd')}
                  </Text>
                </Button>
              )
            })}
          </div>
        )
      }

      export default DaySelector