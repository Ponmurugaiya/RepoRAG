import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import Home from './pages/Home.jsx'
import './App.css'

// Only show Google button when Cognito domain/OAuth is configured
const hasOAuth = Boolean(import.meta.env.VITE_COGNITO_DOMAIN)

export default function App() {
  return (
    <Authenticator
      socialProviders={hasOAuth ? ['google'] : []}
    >
      {({ signOut, user }) => (
        <Home signOut={signOut} user={user} />
      )}
    </Authenticator>
  )
}
