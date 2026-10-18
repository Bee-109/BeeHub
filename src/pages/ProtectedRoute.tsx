
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute() {
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    let active = true

    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()

      if (active) {
        setAuthenticated(Boolean(session))
        setChecking(false)
      }
    }

    checkSession()

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (active) {
          setAuthenticated(Boolean(session))
          setChecking(false)
        }
      })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (checking) {
    return <main style={{ padding: '40px', color: '#f5c451' }}>
      Checking access to the Hive...
    </main>
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

