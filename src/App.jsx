import { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [productToDisable, setProductToDisable] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Activos'); // Estado del combobox
  const [showInactiveProducts, setShowInactiveProducts] = useState(false); // Estado modal de los productos inactivos

  useEffect(() => {
    fetch('https://3zn8rhvzul.execute-api.us-east-2.amazonaws.com/api/articulos/hu-tp-87')
      .then(response => response.json())
      .then(data => {
        setProducts(data.products.map(product => ({
          id: product.product_id,
          name: product.product_name,
          image: product.image_url,
          category: '', // No hay categoría en la respuesta API, por lo que la dejamos vacía.
          description: product.description,
          price: product.price,
          active: product.active,
        })));
      })
      .catch(error => console.error(error));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleProductActivation = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, active: !product.active }
          : product
      )
    );
  };

  const handleNewProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setShowNewProductForm(false);
    setShowSuccessMessage(true);
  };

  const handleDisableConfirmation = (product) => {
    setProductToDisable(product);
    setShowConfirmationModal(true);
  };

  const handleConfirmDisable = () => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productToDisable.id
          ? { ...product, active: false }
          : product
      )
    );
    setShowConfirmationModal(false);
  };

  const handleCancelDisable = () => {
    setShowConfirmationModal(false);
  };

  const handleActiveFilterChange = (filter) => {
    setActiveFilter(filter);
    setShowInactiveProducts(filter === 'Inactivos');
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'Todas') {
      return true;
    } else {
      return product.category === selectedCategory;
    }
  }).filter((product) => {
    if (activeFilter === 'Activos') {
      return product.active;
    } else {
      return !product.active;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src="/logo-3.png" // imagen local
            alt="FIA Fit Logo"
            className="w-48 h-25"
          />
          <h1 className="text-2xl font-bold ml-4">FIA FIT</h1>
        </div>
        <div className="flex items-center">
          <h2 className="text-lg font-bold mr-4">Inicio</h2>
          <img
            src="/user.jpg" // imagen local
            alt="User Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>

      <div className="flex justify-between mb-8">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">Lista de Productos</h2>
        </div>
        <div className="flex items-center">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowNewProductForm(true)}
          >
            + Registrar Nuevo Producto
          </button>
          <select
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded ml-2"
            value={activeFilter}
            onChange={(e) => handleActiveFilterChange(e.target.value)}
          >
            <option value="Activos">Activos</option>
            <option value="Inactivos">Inactivos</option>
          </select>

          {showNewProductForm && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <NewProductForm onSubmit={handleNewProduct} />
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setShowNewProductForm(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
          {showSuccessMessage && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-green-500 font-bold text-lg">
                  PRODUCTO AGREGADO CON EXITO
                </p>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setShowSuccessMessage(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
          {showConfirmationModal && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-700 font-bold text-lg mb-4">
                  ¿Seguro que desea deshabilitar el producto
                  '{productToDisable.name}'?
                </p>
                <div className="flex justify-end">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={handleConfirmDisable}
                  >
                    Sí
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleCancelDisable}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
          {showInactiveProducts && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Productos Inactivos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white p-4 rounded shadow-md"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-contain mb-2"
                      />
                      <h4 className="text-lg font-bold mb-2">{product.name}</h4>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <p className="text-gray-600 mb-2">Precio: ${product.price}</p>
                    </div>
                  ))}
                </div>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setShowInactiveProducts(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <center>
        <div className="flex">
          <div className="w-1/4">
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-lg font-bold mb-2">Seleccionar</h3>
              <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 ${
                  selectedCategory === 'Todas' ? 'bg-red-700' : ''
                }`}
                onClick={() => handleCategoryChange('Todas')}
              >
                Todas
              </button>
              <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 ${
                  selectedCategory === 'Accesorios Deportivos'
                    ? 'bg-red-700'
                    : ''
                }`}
                onClick={() => handleCategoryChange('Accesorios Deportivos')}
              >
                Accesorios Deportivos
              </button>
              <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 ${
                  selectedCategory === 'Máquina' ? 'bg-red-700' : ''
                }`}
                onClick={() => handleCategoryChange('Máquina')}
              >
                Máquina
              </button>
              <button
                className={`bg-red-500 hover:bg -red-700 text-white font-bold py-2 px-4 rounded mb-2 ${
                  selectedCategory === 'Equipo de Ejercicios'
                    ? 'bg-red-700'
                    : ''
                }`}
                onClick={() => handleCategoryChange('Equipo de Ejercicios')}
              >
                Equipo de Ejercicios
              </button>
              <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 ${
                  selectedCategory === 'Ropa Deportiva' ? 'bg-red-700' : ''
                }`}
                onClick={() => handleCategoryChange('Ropa Deportiva')}
              >
                Ropa Deportiva
              </button>
              <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 ${
                  selectedCategory === 'Suplementos' ? 'bg-red-700' : ''
                }`}
                onClick={() => handleCategoryChange('Suplementos')}
              >
                Suplementos
              </button>
            </div>
          </div>
          <div className="w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded shadow-md"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-2"
                  />
                  <h4 className="text-lg font-bold mb-2">{product.name}</h4>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-gray-600 mb-2">Precio: ${product.price}</p>
                  <button
                    className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 ${
                      product.active ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    onClick={product.active ? () => handleDisableConfirmation(product) : () => handleProductActivation(product.id)}
                  >
                    {product.active ? 'Deshabilitar' : 'Activar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </center>

      <div className="text-center mt-8">
        <p className="text-gray-600">Copyright 2024</p>
      </div>
    </div>
  );
}

function NewProductForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState(''); // Nuevo estado para la descripción.
  const [price, setPrice] = useState(0); // Nuevo estado por precio.
  const [active, setActive] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      onSubmit({
        id: Date.now(),
        name,
        image: e.target.result,
        category,
        description, // Inclui descripción en el objeto.
        price, // Inclui precio en el objeto.
        active,
      });
    };
    if (image) {
      reader.readAsDataURL(image);
    } else {
      // Maneje el caso donde no se selecciona ninguna imagen.
      onSubmit({
        id: Date.now(),
        name,
        image: 'placeholder.jpg', // Reemplazar con la ruta de imagen de marcador de posición predeterminada.
        category,
        description, // Inclui descripción en el objeto.
        price, // Inclui precio en el objeto.
        active,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Nombre del producto
        </label>
        <input
          type="text"
          id="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
          Imagen
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 font-bold mb- 2">
          Categoría
        </label>
        <select
          id="category"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Seleccionar categoría</option>
          <option value="Accesorios Deportivos">Accesorios Deportivos</option>
          <option value="Máquina">Máquina</option>
          <option value="Equipo de Ejercicios">
            Equipo de Ejercicios
          </option>
          <option value="Ropa Deportiva">Ropa Deportiva</option>
          <option value="Suplementos">Suplementos</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Descripción
        </label>
        <textarea
          id="description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
          Precio
        </label>
        <input
          type="number"
          id="price"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="active" className="block text-gray-700 font-bold mb-2">
          Activo
        </label>
        <input
          type="checkbox"
          id="active"
          className="form-checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
      </div>
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Registrar Producto
      </button>
    </form>
  );
}

export default App;