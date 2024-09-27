import { useState } from "react";
import { useShoppingCart } from "../../hooks";

const Modal = ({ product, closeModal }) => {
  const [quantity, setQuantity] = useState(1);
  const { addProduct } = useShoppingCart();

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addProduct(product, quantity);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
          <button onClick={closeModal} className="text-xl font-bold">
            ✖
          </button>
        </div>
        <img src={product.image_url} alt={product.name} className="mb-4" />
        <div className="mb-4">
          <span className="font-medium">Precio: </span>
          <span className="text-red-500">S/ {product.price}</span>
        </div>
        <div className="mb-4">
          <span className="font-medium">Peso: </span>
          <span>{product.weight}kg</span>{" "}
        </div>
        <div className="mb-4">
          <span className="font-medium">Detalles del Producto:</span>
          <p>{product.description}</p>
        </div>
        <div className="flex items-center mb-4">
          <button
            onClick={decreaseQuantity}
            className="bg-gray-200 px-2 py-1 font-bold"
          >
            -
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="bg-gray-200 px-2 py-1 font-bold"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-red-700 hover:bg-green-800 text-slate-200 font-medium border rounded-lg px-4 py-2 w-full"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default Modal;
