import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const initialProducts = [
    { id: 1, nombre: "Monitor", precio: 250, stock: 10 },
    { id: 2, nombre: "Teclado", precio: 50, stock: 25 },
    { id: 3, nombre: "Mouse", precio: 30, stock: 40 }
  ]

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        return parsedProducts.length > 0 ? parsedProducts : initialProducts
      } catch (error) {
        console.error('Error parsing saved products:', error)
        return initialProducts
      }
    }
    return initialProducts
  })
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: ''
  })

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products))
  }, [products])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingProduct) {
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...formData, precio: Number(formData.precio), stock: Number(formData.stock) }
          : product
      ))
      setEditingProduct(null)
    } else {
      const newProduct = {
        id: Date.now(),
        nombre: formData.nombre,
        precio: Number(formData.precio),
        stock: Number(formData.stock)
      }
      setProducts([...products, newProduct])
    }
    setFormData({ nombre: '', precio: '', stock: '' })
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock
    })
  }

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id))
  }

  return (
    <div className="container">
      <h1>Gestión de Inventario</h1>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={formData.nombre}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formData.precio}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          {editingProduct ? 'Actualizar' : 'Agregar'} Producto
        </button>
      </form>

      <div className="products-list">
        <h2>Lista de Productos</h2>
        {products.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.nombre}</td>
                    <td>${product.precio}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button onClick={() => handleEdit(product)}>Editar</button>
                      <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No hay productos en el inventario</p>
        )}
      </div>
    </div>
  )
}

export default App
