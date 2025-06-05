import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../atoms/Icon'
import Text from '../atoms/Text'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Select from '../atoms/Select'
import expenseService from '../../services/api/expenseService'

const ExpenseModal = ({ isOpen, onClose, tripId }) => {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState('list') // 'list', 'add', 'summary'
  const [newExpense, setNewExpense] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = [
    { value: 'accommodation', label: 'Accommodation', icon: 'Home' },
    { value: 'food', label: 'Food & Dining', icon: 'UtensilsCrossed' },
    { value: 'transportation', label: 'Transportation', icon: 'Car' },
    { value: 'activities', label: 'Activities & Tours', icon: 'Camera' },
    { value: 'other', label: 'Other', icon: 'MoreHorizontal' }
  ]

  useEffect(() => {
    if (isOpen && tripId) {
      loadExpenses()
      loadSummary()
    }
  }, [isOpen, tripId])

  const loadExpenses = async () => {
    setLoading(true)
    try {
      const result = await expenseService.getByTripId(tripId)
      setExpenses(result || [])
    } catch (error) {
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  const loadSummary = async () => {
    try {
      const result = await expenseService.getTripSummary(tripId)
      setSummary(result)
    } catch (error) {
      console.error('Failed to load expense summary:', error)
    }
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    
    if (!newExpense.title || !newExpense.amount) {
      toast.warning('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      const expenseData = {
        ...newExpense,
        tripId: parseInt(tripId),
        amount: parseFloat(newExpense.amount),
        currency: 'USD',
        paidBy: {
          memberId: 1,
          name: 'Sarah Johnson'
        },
        splits: [
          { memberId: 1, name: 'Sarah Johnson', amount: parseFloat(newExpense.amount) / 4, paid: true },
          { memberId: 2, name: 'Mike Chen', amount: parseFloat(newExpense.amount) / 4, paid: false },
          { memberId: 3, name: 'Emma Davis', amount: parseFloat(newExpense.amount) / 4, paid: false },
          { memberId: 4, name: 'Alex Rodriguez', amount: parseFloat(newExpense.amount) / 4, paid: false }
        ]
      }

      await expenseService.create(expenseData)
      toast.success('Expense added successfully!')
      
      setNewExpense({
        title: '',
        description: '',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      })
      
      setActiveView('list')
      loadExpenses()
      loadSummary()
    } catch (error) {
      toast.error('Failed to add expense')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentToggle = async (expenseId, memberId, currentStatus) => {
    try {
      await expenseService.updatePaymentStatus(expenseId, memberId, !currentStatus)
      toast.success('Payment status updated!')
      loadExpenses()
      loadSummary()
    } catch (error) {
      toast.error('Failed to update payment status')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category)
    return categoryData?.icon || 'MoreHorizontal'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="DollarSign" className="h-6 w-6" />
              <Text as="h2" className="text-xl font-semibold">Expense Management</Text>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <Icon name="X" className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mt-4">
            {[
              { id: 'list', label: 'Expenses', icon: 'List' },
              { id: 'add', label: 'Add New', icon: 'Plus' },
              { id: 'summary', label: 'Summary', icon: 'BarChart3' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === tab.id
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-white text-opacity-70 hover:text-opacity-100'
                }`}
              >
                <Icon name={tab.icon} className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {activeView === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <Text className="text-gray-500 mt-2">Loading expenses...</Text>
                  </div>
                ) : expenses.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Receipt" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">No expenses yet</Text>
                    <Text className="text-gray-500 mb-4">Start tracking your trip expenses</Text>
                    <Button
                      onClick={() => setActiveView('add')}
                      className="bg-primary text-white px-6 py-2 rounded-lg"
                    >
                      Add First Expense
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="bg-white p-2 rounded-lg">
                              <Icon name={getCategoryIcon(expense.category)} className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <Text as="h4" className="font-semibold text-gray-900">{expense.title}</Text>
                              <Text className="text-sm text-gray-500">{expense.description}</Text>
                              <Text className="text-xs text-gray-400 mt-1">
                                Paid by {expense.paidBy.name} • {new Date(expense.date).toLocaleDateString()}
                              </Text>
                            </div>
                          </div>
                          <Text className="text-lg font-bold text-gray-900">
                            {formatCurrency(expense.amount)}
                          </Text>
                        </div>

                        {/* Member Splits */}
                        <div className="grid grid-cols-2 gap-2">
                          {expense.splits.map((split) => (
                            <div key={split.memberId} className="flex items-center justify-between bg-white p-2 rounded">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${split.paid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <Text className="text-sm">{split.name}</Text>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Text className="text-sm font-medium">{formatCurrency(split.amount)}</Text>
                                <button
                                  onClick={() => handlePaymentToggle(expense.id, split.memberId, split.paid)}
                                  className={`p-1 rounded ${
                                    split.paid 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'bg-red-100 text-red-600'
                                  }`}
                                >
                                  <Icon name={split.paid ? 'Check' : 'X'} className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeView === 'add' && (
              <motion.div
                key="add"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <form onSubmit={handleAddExpense} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Input
                        label="Expense Title *"
                        value={newExpense.title}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Hotel Accommodation"
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={newExpense.description}
                          onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Additional details about this expense"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <Input
                        type="date"
                        label="Date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-4">
                      <Input
                        type="number"
                        label="Amount (USD) *"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />

                      <Select
                        label="Category"
                        value={newExpense.category}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                        options={categories.map(cat => ({ value: cat.value, label: cat.label }))}
                      />

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <Text className="text-sm text-blue-800 font-medium mb-2">Split Information</Text>
                        <Text className="text-xs text-blue-600">
                          This expense will be split equally among all trip members. 
                          You can adjust individual payment status after creation.
                        </Text>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      type="button"
                      onClick={() => setActiveView('list')}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-white px-6 py-2"
                    >
                      {loading ? 'Adding...' : 'Add Expense'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeView === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {summary && (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <Text className="text-sm text-blue-600 mb-1">Total Expenses</Text>
                        <Text className="text-2xl font-bold text-blue-900">{summary.totalExpenses}</Text>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <Text className="text-sm text-green-600 mb-1">Total Amount</Text>
                        <Text className="text-2xl font-bold text-green-900">
                          {formatCurrency(summary.totalAmount)}
                        </Text>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <Text className="text-sm text-purple-600 mb-1">Per Person</Text>
                        <Text className="text-2xl font-bold text-purple-900">
                          {formatCurrency(summary.totalAmount / 4)}
                        </Text>
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Text as="h3" className="font-semibold text-gray-900 mb-4">Expenses by Category</Text>
                      <div className="space-y-3">
                        {Object.entries(summary.categorySummary).map(([category, amount]) => {
                          const categoryData = categories.find(cat => cat.value === category)
                          const percentage = (amount / summary.totalAmount) * 100
                          
                          return (
                            <div key={category} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Icon name={categoryData?.icon || 'MoreHorizontal'} className="h-5 w-5 text-gray-600" />
                                <Text className="font-medium">{categoryData?.label || category}</Text>
                              </div>
                              <div className="text-right">
                                <Text className="font-semibold">{formatCurrency(amount)}</Text>
                                <Text className="text-xs text-gray-500">{percentage.toFixed(1)}%</Text>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default ExpenseModal