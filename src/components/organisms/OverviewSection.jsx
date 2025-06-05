import StatCard from '../molecules/StatCard'
      import ProgressBar from '../molecules/ProgressBar'
      import Text from '../atoms/Text'

      const OverviewSection = ({ trip }) => {
        const days = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))
        // Mock data for other stats as they are hardcoded in original Home.jsx
        const activities = 12
        const hotels = 3
        const mustSee = 8
        const planningProgress = 78

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard iconName="Calendar" iconColor="text-primary" value={days} label="Days" />
                <StatCard iconName="MapPin" iconColor="text-secondary" value={activities} label="Activities" />
                <StatCard iconName="Home" iconColor="text-accent" value={hotels} label="Hotels" />
                <StatCard iconName="Star" iconColor="text-purple-600" value={mustSee} label="Must-See" />
              </div>
            </div>

            {/* Trip Description */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-card">
              <Text as="h2" className="text-xl font-semibold text-gray-900 mb-4">Trip Overview</Text>
              <Text as="p" className="text-gray-600 leading-relaxed mb-6">{trip.description}</Text>
              
              <ProgressBar label="Planning Progress" value={planningProgress} />
            </div>
          </div>
        )
      }

      export default OverviewSection