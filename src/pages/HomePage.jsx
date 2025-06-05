import { useState, useEffect } from 'react'
      import { AnimatePresence } from 'framer-motion'
      import DefaultPageLayout from '../components/templates/DefaultPageLayout'
      import TripDetailPageLayout from '../components/templates/TripDetailPageLayout'
      import Icon from '../components/atoms/Icon'
      import Text from '../components/atoms/Text'
      import OverviewSection from '../components/organisms/OverviewSection'
      import QuickActions from '../components/organisms/QuickActions'
      import ItineraryTimeline from '../components/organisms/ItineraryTimeline'
      import AccommodationList from '../components/organisms/AccommodationList'
      import PlaceList from '../components/organisms/PlaceList'
      import ExpenseModal from '../components/organisms/ExpenseModal'
      import tripService from '../services/api/tripService'

const HomePage = () => {
        const [trips, setTrips] = useState([])
        const [currentTrip, setCurrentTrip] = useState(null)
        const [activeTab, setActiveTab] = useState('overview')
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState(null)
        const [expenses, setExpenses] = useState([])
        const [expenseSummary, setExpenseSummary] = useState(null)
useEffect(() => {
          const loadTrips = async () => {
            setLoading(true)
            try {
              const result = await tripService.getAll()
              setTrips(result || [])
              if (result?.length > 0) {
                setCurrentTrip(result[0])
              }
            } catch (err) {
              setError(err.message)
            } finally {
              setLoading(false)
            }
          }
          loadTrips()
        }, [])

        useEffect(() => {
          if (currentTrip?.id) {
            const mockExpenses = [
              {
                id: 1,
                title: 'Hotel Booking',
                amount: 450,
                date: new Date().toISOString(),
                paidBy: { name: 'John Doe' },
                category: 'accommodation'
              },
              {
                id: 2,
                title: 'Flight Tickets',
                amount: 680,
                date: new Date().toISOString(),
                paidBy: { name: 'Jane Smith' },
                category: 'transportation'
              }
            ]
            setExpenses(mockExpenses)
            
            const totalAmount = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0)
            const categorySummary = mockExpenses.reduce((acc, expense) => {
              acc[expense.category] = (acc[expense.category] || 0) + expense.amount
              return acc
            }, {})
            
            setExpenseSummary({
              totalExpenses: mockExpenses.length,
              totalAmount,
              categorySummary
            })
          }
        }, [currentTrip])

        const tabs = [
          { id: 'overview', label: 'Overview', icon: 'MapPin' },
          { id: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
          { id: 'accommodation', label: 'Accommodation', icon: 'Home' },
          { id: 'places', label: 'Places', icon: 'Star' },
          { id: 'map', label: 'Map', icon: 'Map', disabled: true },
          { id: 'expenses', label: 'Expenses', icon: 'DollarSign', disabled: true }
        ]

        if (loading || error || !currentTrip) {
          return (
            <DefaultPageLayout 
              loading={loading}
              error={error}
              iconName="Plane"
              title="Welcome to TripSync!"
              description="Start planning your next adventure with your group."
              buttonLabel="Create Your First Trip"
              onButtonClick={() => console.log('Create Trip clicked')}
            />
          )
        }

        const tripDuration = Math.ceil((new Date(currentTrip.endDate) - new Date(currentTrip.startDate)) / (1000 * 60 * 60 * 24)) + 1
        const tripStartDate = new Date(currentTrip.startDate)

        return (
          <TripDetailPageLayout
            trip={currentTrip}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <>
                  <OverviewSection trip={currentTrip} />
                  <QuickActions />
                </>
              )}

              {activeTab === 'itinerary' && (
                <ItineraryTimeline 
                  tripId={currentTrip.id} 
                  tripStartDate={tripStartDate}
                  tripDuration={tripDuration}
                />
              )}

              {activeTab === 'accommodation' && (
                <AccommodationList tripId={currentTrip.id} />
              )}

              {activeTab === 'places' && (
                <PlaceList tripId={currentTrip.id} />
)}

              {activeTab === 'map' && (
                <div className="bg-white p-12 rounded-xl shadow-card text-center">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Icon name="Map" className="h-8 w-8 text-gray-400" />
                  </div>
                  <Text as="h3" className="text-xl font-semibold text-gray-900 mb-3">
                    Interactive Map Coming Soon
                  </Text>
                  <Text as="p" className="text-gray-500">
                    See all your trip locations in one beautiful interactive map view!
                  </Text>
                </div>
              )}

              {activeTab === 'expenses' && (
                <div className="space-y-6">
                  {/* Expense Summary Cards */}
                  {expenseSummary && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white p-6 rounded-xl shadow-card">
                        <div className="flex items-center justify-between">
                          <div>
                            <Text className="text-sm text-gray-500">Total Expenses</Text>
                            <Text className="text-2xl font-bold text-gray-900">{expenseSummary.totalExpenses}</Text>
                          </div>
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <Icon name="Receipt" className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-card">
                        <div className="flex items-center justify-between">
                          <div>
                            <Text className="text-sm text-gray-500">Total Amount</Text>
                            <Text className="text-2xl font-bold text-gray-900">
                              ${expenseSummary.totalAmount?.toLocaleString() || '0'}
                            </Text>
                          </div>
                          <div className="bg-green-100 p-3 rounded-lg">
                            <Icon name="DollarSign" className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-card">
                        <div className="flex items-center justify-between">
                          <div>
                            <Text className="text-sm text-gray-500">Per Person</Text>
                            <Text className="text-2xl font-bold text-gray-900">
                              ${((expenseSummary.totalAmount || 0) / 4).toLocaleString()}
                            </Text>
                          </div>
                          <div className="bg-purple-100 p-3 rounded-lg">
                            <Icon name="Users" className="h-6 w-6 text-purple-600" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-card">
                        <div className="flex items-center justify-between">
                          <div>
                            <Text className="text-sm text-gray-500">Categories</Text>
                            <Text className="text-2xl font-bold text-gray-900">
                              {Object.keys(expenseSummary.categorySummary || {}).length}
                            </Text>
                          </div>
                          <div className="bg-orange-100 p-3 rounded-lg">
                            <Icon name="Tag" className="h-6 w-6 text-orange-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Expenses */}
                  <div className="bg-white rounded-xl shadow-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <Text as="h3" className="text-lg font-semibold text-gray-900">Recent Expenses</Text>
                      <ExpenseModal
                        isOpen={false}
                        onClose={() => {}}
                        tripId={currentTrip.id}
                        trigger={
                          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                            Manage Expenses
                          </button>
                        }
                      />
                    </div>

                    {expenses.length === 0 ? (
                      <div className="text-center py-8">
                        <Icon name="Receipt" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <Text as="h4" className="text-lg font-medium text-gray-900 mb-2">No expenses yet</Text>
                        <Text className="text-gray-500">Start tracking your trip expenses</Text>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {expenses.slice(0, 5).map((expense) => (
                          <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="bg-white p-2 rounded-lg">
                                <Icon name="Receipt" className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <Text className="font-medium text-gray-900">{expense.title}</Text>
                                <Text className="text-sm text-gray-500">
                                  Paid by {expense.paidBy?.name} • {new Date(expense.date).toLocaleDateString()}
                                </Text>
                              </div>
                            </div>
                            <Text className="font-semibold text-gray-900">
                              ${expense.amount?.toLocaleString()}
                            </Text>
                          </div>
                        ))}
                        
                        {expenses.length > 5 && (
                          <div className="text-center pt-4">
                            <Text className="text-sm text-gray-500">
                              And {expenses.length - 5} more expenses...
                            </Text>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </TripDetailPageLayout>
        )
      }

      export default HomePage