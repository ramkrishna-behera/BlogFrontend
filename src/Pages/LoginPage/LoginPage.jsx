import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginStart, loginSuccess, loginFailure } from "../../redux/authSlice"
import { Button } from "../../Components/ui/button"
import { Input } from "../../Components/ui/input"
import { Card } from "../../Components/ui/card"

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { token, loading, error } = useSelector((state) => state.auth)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [alreadyLoggedInMsg, setAlreadyLoggedInMsg] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      setAlreadyLoggedInMsg(true)
      setTimeout(() => {
        navigate("/")
      }, 2000)
    }
  }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        dispatch(loginSuccess({ user: data.user, token: data.token }))
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("authUser", JSON.stringify(data.user))
        navigate("/")
      } else {
        dispatch(loginFailure(data.message || "Login failed"))
      }
    } catch (err) {
      dispatch(loginFailure(err.message || "Network error"))
    }
  }

  if (alreadyLoggedInMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 rounded-xl shadow-lg text-center bg-white/70 backdrop-blur-xl border border-white/20">
          <h2 className="text-xl font-semibold mb-2">You are already logged in!</h2>
          <p>Redirecting to home...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:bg-white focus:border-blue-500 transition-all"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:bg-white focus:border-blue-500 transition-all"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        </form>

        {/* Register Button */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={() => navigate("/register")}
            variant="outline"
            className="w-full h-12 bg-white/50 hover:bg-white/70 text-gray-700 rounded-xl font-medium border border-gray-200 backdrop-blur-sm transition-all"
          >
            Create an Account
          </Button>
        </div>
      </Card>
    </div>
  )
}
