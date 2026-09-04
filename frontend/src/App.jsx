import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MobileLayout from './components/MobileLayout'
import Accounting from './pages/Accounting'
import ExpenseForm from './pages/ExpenseForm'
import ProjectDetail from './pages/ProjectDetail'
import ProjectForm from './pages/ProjectForm'
import ProjectList from './pages/ProjectList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<ProjectList />} />
          <Route path="/proyecto/:id" element={<ProjectDetail />} />
          <Route path="/nuevo" element={<ProjectForm />} />
          <Route path="/editar/:id" element={<ProjectForm />} />
          <Route path="/contable" element={<Accounting />} />
          <Route path="/nuevo-gasto" element={<ExpenseForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App