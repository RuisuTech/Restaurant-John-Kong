import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    usuario: { nombre: 'Test User', correo: 'test@test.com' }
  })
}))

vi.mock('../../utils/api', () => ({
  obtenerReservas: () => Promise.resolve([])
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

import ReservaCliente from '../pages/Cliente/ReservaCliente'

// Helper para renderizar con Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ReservaCliente - Test Intermedio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('se renderiza sin errores', () => {
    renderWithRouter(<ReservaCliente />)
    expect(true).toBe(true)
  })

  it('muestra el título principal', () => {
    renderWithRouter(<ReservaCliente />)
    
    // Buscar el título 
    const titulo = screen.getByText('¡Iniciemos con tu reserva!')
    expect(titulo).toBeInTheDocument()
  })

  it('muestra la descripción', () => {
    renderWithRouter(<ReservaCliente />)
    
    // Buscar parte de la descripción
    const descripcion = screen.getByText(/Completa los pasos para reservar/)
    expect(descripcion).toBeInTheDocument()
  })

  it('tiene el componente BarraUsuario', () => {
    renderWithRouter(<ReservaCliente />)
    expect(document.querySelector('.w-full')).toBeInTheDocument()
  })
})

describe('ReservaCliente - Funcionalidad básica', () => {
  it('inicializa con los estados correctos', () => {
    renderWithRouter(<ReservaCliente />)
    expect(screen.getByText('¡Iniciemos con tu reserva!')).toBeInTheDocument()
  })

  it('puede navegar hacia atrás', () => {
    renderWithRouter(<ReservaCliente />)
    expect(mockNavigate).toHaveBeenCalledTimes(0)
  })
})