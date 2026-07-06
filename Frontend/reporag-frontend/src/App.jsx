import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import Home from './pages/Home.jsx'
import './App.css'

export default function App() {
  return (
    <Authenticator
      socialProviders={['google']}
      variation="modal"
    >
      {({ signOut, user }) => (
        <Home signOut={signOut} user={user} />
      )}
    </Authenticator>
  )
}
