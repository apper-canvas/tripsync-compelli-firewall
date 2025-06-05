import { motion } from 'framer-motion'
      import Icon from '../atoms/Icon'
      import Text from '../atoms/Text'
      import Header from '../organisms/Header'
      import HeroSection from '../organisms/HeroSection'
      import NavigationTabs from '../organisms/NavigationTabs'

      const TripDetailPageLayout = ({ trip, tabs, activeTab, onTabChange, children }) => {
        return (
          <div className="min-h-screen bg-gray-50">
            <Header />
            <HeroSection trip={trip} />
            <NavigationTabs tabs={tabs} activeTab={activeTab} onTabClick={onTabChange} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </main>
          </div>
        )
      }

      export default TripDetailPageLayout