import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Amplify } from 'aws-amplify'

const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      region: import.meta.env.VITE_COGNITO_REGION,
      // Only configure OAuth (Google sign-in) when domain is provided.
      // Without this guard, Amplify throws on undefined domain and causes a blank screen.
      ...(cognitoDomain && {
        loginWith: {
          oauth: {
            domain: cognitoDomain,
            scopes: ['email', 'profile', 'openid'],
            redirectSignIn: [import.meta.env.VITE_OAUTH_REDIRECT_SIGN_IN || 'http://localhost:5173/'],
            redirectSignOut: [import.meta.env.VITE_OAUTH_REDIRECT_SIGN_OUT || 'http://localhost:5173/'],
            responseType: 'code',
          },
        },
      }),
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
