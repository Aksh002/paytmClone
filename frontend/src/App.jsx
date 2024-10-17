import { BrowserRouter,Route,Router, Routes, useNavigate } from 'react-router-dom'
import { Signin } from './client-routes/Signin'
import { Signup } from './client-routes/Signup'
import { Dashboard } from './client-routes/Dashboard'
import { Send } from './client-routes/Send'

import { InputBox } from './components/InputBox'
function App() {
  //const navigate= useNavigate()
  return (
    <div>
      
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/signin' element={<Signin/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/send' element={<Send/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
