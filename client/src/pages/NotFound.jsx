import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="text-center animate-fade-in-up">
        <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent leading-none mb-4">
          404
        </h1>
        <h2 className="text-2xl text-white mb-2">Page Not Found</h2>
        <p className="text-slate-400 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition-all shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
