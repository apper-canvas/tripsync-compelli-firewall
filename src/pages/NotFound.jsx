import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-soft max-w-md">
        <div className="bg-gray-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <ApperIcon name="MapPin" className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Looks like this destination doesn't exist on our map. Let's get you back on track!
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
        >
          <ApperIcon name="Home" className="h-4 w-4" />
          Back to Trips
        </Link>
      </div>
    </div>
  )
}

export default NotFound