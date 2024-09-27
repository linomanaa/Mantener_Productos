import { useState, useEffect } from "react";
import { useShoppingCart } from "../hooks";
import Modal from "./modal/ProductModal";

export default function ProductList() {
  const { products, addProduct } = useShoppingCart();
  const [dataProducts, setDataProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const categories = ["Todas", "ACCESORIOS DEPORTIVOS", "MAQUINA", "EQUIPO DE EJERCICIOS", "ROPA DEPROTIVA", "SUPLEMNETOS"]; // Añade aquí las categorías disponibles

  const checkAvailableToAddCart = (productId) => {
    return Boolean(
      products.find((product) => product.product_type_id === productId)
    );
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://3zn8rhvzul.execute-api.us-east-2.amazonaws.com/api/productos/hu-tp-17"
        );
        const data = await response.json();
        setDataProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "Todas"
    ? dataProducts
    : dataProducts.filter(product => product.category === selectedCategory);

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div className="w-full max-w-6xl px-4 mx-auto mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filtro de Categorías */}
      <div className="lg:col-span-1 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Tipo de Productos</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => setSelectedCategory(category)}
                className={`block w-full text-left p-2 rounded-lg ${
                  selectedCategory === category
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Lista de Productos */}
      <div className="lg:col-span-3 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.product_type_id}
            className="rounded-lg border bg-gray-400/10 flex flex-col h-full"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-contain bg-white mx-auto cursor-pointer"
              onClick={() => openModal(product)}
            />
            <div className="flex flex-col flex-grow gap-y-4 px-4 py-6">
              <h1 className="font-medium">{product.name}</h1>
              <p className="text-sm line-clamp-3">{product.description}</p>
              <span className="font-medium">$ {product.price}</span>
              <button
                className="bg-red-700 hover:bg-green-800 text-slate-200 mt-auto font-medium border rounded-lg px-4 py-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-200"
                onClick={() => addProduct(product)}
                disabled={checkAvailableToAddCart(product.product_type_id)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal product={selectedProduct} closeModal={closeModal} />
      )}
    </div>
  );
}
