import { HashRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.page'
import Login from './pages/Login.page'
import SignUp from './pages/SignUp.page'

function App() {
  return (
    <div className="bg-background flex flex-col">
      <HashRouter>
        <Routes>
          <Route path="" element={<Landing />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="signup" element={<SignUp />}></Route>
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
