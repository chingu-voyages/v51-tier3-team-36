import { HashRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.page'
import Login from './pages/Login.page'
import SignUp from './pages/SignUp.page'
import Home from './pages/Home.page'
import GroupList from './pages/GroupList.page'
import Group from './pages/Group.page'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="" element={<Landing />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
        <Route path="home" element={<Home />}></Route>
        <Route path="groups" element={<GroupList />}></Route>
        <Route path="group/:groupId" element={<Group />}></Route>
      </Routes>
    </HashRouter>
  )
}

export default App
