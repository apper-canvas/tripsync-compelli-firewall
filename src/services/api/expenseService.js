import expensesData from '../mockData/expenses.json'

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory data store (simulates database)
let expenses = [...expensesData]

const expenseService = {
  // Get all expenses
  async getAll() {
    await delay(300)
    return [...expenses]
  },

  // Get expenses by trip ID
  async getByTripId(tripId) {
    await delay(250)
    return expenses.filter(expense => expense.tripId === tripId)
  },

  // Get expense by ID
  async getById(id) {
    await delay(200)
    const expense = expenses.find(exp => exp.id === id)
    return expense ? { ...expense } : null
  },

  // Create new expense
  async create(expenseData) {
    await delay(400)
    const newExpense = {
      id: Date.now(),
      ...expenseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    expenses.push(newExpense)
    return { ...newExpense }
  },

  // Update expense
  async update(id, updates) {
    await delay(350)
    const index = expenses.findIndex(expense => expense.id === id)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    
    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return { ...expenses[index] }
  },

  // Delete expense
  async delete(id) {
    await delay(300)
    const index = expenses.findIndex(expense => expense.id === id)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    
    const deletedExpense = { ...expenses[index] }
    expenses.splice(index, 1)
    return deletedExpense
  },

  // Get expense summary for a trip
  async getTripSummary(tripId) {
    await delay(250)
    const tripExpenses = expenses.filter(expense => expense.tripId === tripId)
    
    const totalAmount = tripExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalExpenses = tripExpenses.length
    
    const categorySummary = tripExpenses.reduce((summary, expense) => {
      summary[expense.category] = (summary[expense.category] || 0) + expense.amount
      return summary
    }, {})

    return {
      totalAmount,
      totalExpenses,
      categorySummary,
      expenses: tripExpenses
    }
  },

  // Update payment status
  async updatePaymentStatus(expenseId, memberId, status) {
    await delay(300)
    const expense = expenses.find(exp => exp.id === expenseId)
    if (!expense) {
      throw new Error('Expense not found')
    }

    const memberSplit = expense.splits.find(split => split.memberId === memberId)
    if (memberSplit) {
      memberSplit.paid = status
      expense.updatedAt = new Date().toISOString()
    }

    return { ...expense }
  }
}

export default expenseService