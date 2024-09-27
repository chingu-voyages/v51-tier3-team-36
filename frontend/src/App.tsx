import { HashRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.page'

function App() {
  return (
    <div className="bg-background flex flex-col">
      <HashRouter>
        <Routes>
          <Route path="" element={<Landing />}></Route>
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
