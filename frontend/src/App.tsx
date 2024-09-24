import { HashRouter, Route, Routes } from 'react-router-dom'
import Temp from './components/Temp.component'

function App() {
  return (
    <div className="bg-background flex flex-col">
      <HashRouter>
        <Routes>
          <Route path="" element={<Temp />}></Route>
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
