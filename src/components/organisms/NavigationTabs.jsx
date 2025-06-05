import TabButton from '../molecules/TabButton'

      const NavigationTabs = ({ tabs, activeTab, onTabClick }) => {
        return (
          <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-0 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    label={tab.label}
                    icon={tab.icon}
                    onClick={() => !tab.disabled && onTabClick(tab.id)}
                    isActive={activeTab === tab.id}
                    disabled={tab.disabled}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      }

      export default NavigationTabs