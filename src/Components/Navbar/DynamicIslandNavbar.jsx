
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Home, BookOpen, User, LogIn, LogOut, Menu, X, PenTool, Compass } from "lucide-react" // ← added Compass
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../redux/authSlice"

export default function DynamicIslandNavbar() {
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleMouseEnter = () => {
    if (!isMobile) setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsExpanded(false)
      setShowSearch(false)
    }
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  // increased widths slightly to fit the new Explore button comfortably
  const baseWidth = 880
  const hoverWidth = 940
  const searchWidth = 1100
  const currentWidth = showSearch ? searchWidth : isExpanded ? hoverWidth : baseWidth

  return (
    <>
      {/* Desktop Navbar */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
        <div
          style={{ width: currentWidth }}
          className="relative transition-all duration-500 ease-in-out h-14 hover:scale-105"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Glassmorphism Container */}
          <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/25 transition-all duration-500 ease-in-out">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
            <div
              className={`absolute inset-0 rounded-full transition-all duration-500 ease-in-out ${
                isExpanded ? "bg-white/5 shadow-2xl shadow-blue-500/20" : ""
              }`}
            />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center px-4 overflow-hidden">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0 mr-6">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-sm whitespace-nowrap">BlogSpace</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-4 flex-shrink-0">
              <Link
                to="/"
                className="text-white/80 hover:text-white hover:scale-110 transition-all duration-200 flex items-center space-x-1 whitespace-nowrap"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </Link>

              {/* NEW: Explore */}
              <Link
                to="/explore"
                className="text-white/80 hover:text-white hover:scale-110 transition-all duration-200 flex items-center space-x-1 whitespace-nowrap"
              >
                <Compass className="w-4 h-4" />
                <span className="text-sm font-medium">Explore</span>
              </Link>

              
              <Link
                to="/about"
                className="text-white/80 hover:text-white hover:scale-110 transition-all duration-200 flex items-center space-x-1 whitespace-nowrap"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">About</span>
              </Link>
              <Link
                to="/write"
                className="text-white/80 hover:text-white hover:scale-110 transition-all duration-200 flex items-center space-x-1 whitespace-nowrap"
              >
                <PenTool className="w-4 h-4" />
                <span className="text-sm font-medium">Write</span>
              </Link>
            </nav>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Search and Auth Buttons */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Search */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSearch}
                  className="text-white hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-200 h-8 w-8 p-0 flex-shrink-0"
                  aria-label="Toggle search"
                >
                  <Search className="w-4 h-4 text-white" />
                </Button>
                {showSearch && (
                  <Input
                    placeholder="Search..."
                    autoFocus
                    className="w-48 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-8"
                  />
                )}
              </div>

              {/* Auth */}
              {token && user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm font-medium max-w-[120px] truncate" title={user.email}>
                    {user.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-white hover:text-red-500 transition-colors duration-200 h-8 px-2 flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs">Logout</span>
                  </Button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-200 h-8 px-3 flex items-center space-x-1 rounded whitespace-nowrap"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="fixed top-4 left-4 right-4 z-50 md:hidden">
        <div className={`relative transition-all duration-300 ease-in-out ${showMobileMenu ? "h-auto" : "h-14"}`}>
          {/* Glassmorphism container */}
          <div className="absolute inset-0 transition-all duration-300 ease-in-out bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/25 rounded-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
          </div>

          {/* Content */}
          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold">BlogSpace</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>

            {/* Expanded Menu */}
            {showMobileMenu && (
              <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-4">
                <Link
                  to="/"
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors py-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>

                {/* NEW: Explore */}
                <Link
                  to="/explore"
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors py-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore</span>
                </Link>

                <Link
                  to="/categories"
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors py-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Categories</span>
                </Link>
                <Link
                  to="/about"
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors py-2"
                >
                  <User className="w-4 h-4" />
                  <span>About</span>
                </Link>
                <Link
                  to="/write"
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors py-2"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Write</span>
                </Link>

                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/80" />
                    <Input
                      placeholder="Search..."
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                    />
                  </div>
                  {token && user ? (
                    <div className="flex items-center justify-between text-white">
                      <span className="truncate max-w-[150px]" title={`${user.name} (${user.email})`}>
                        {user.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-white hover:text-red-500 transition-colors duration-200 h-8 px-3 flex items-center space-x-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </Button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded py-2"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login / Register
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
