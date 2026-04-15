import {router} from './app.routes.jsx'
import { RouterProvider } from 'react-router-dom'
import { AuthContext } from './features/auth/auth.context.jsx'
import { AuthProvider } from './features/auth/auth.context.jsx'
import { InterviewProvider } from './features/interview/interview.context.jsx'
function App() {
  

  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router}/>
      </InterviewProvider>
    </AuthProvider>
  
  )
}

export default App
