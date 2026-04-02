import MainLayout from "./features/layouts/MainLayout"
import Tickets from "./features/tickets/Tickets"

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
      