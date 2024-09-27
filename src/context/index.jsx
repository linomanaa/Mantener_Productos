import { createContext, useCallback, useMemo, useState } from "react";

export const ShoppingCartContext = createContext({
  products: [],
  totalAmount: 0,
  addProduct: () => {},
  removeProduct: () => {},
  clearShoppingCart: () => {},
});

export const ShoppingCartProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const totalAmount = useMemo(() => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }, [products]);

  const addProduct = useCallback((newProduct, quantity = 1) => {
    setProducts((prevProducts) => {
      const existingProductIndex = prevProducts.findIndex(
        (product) => product.product_type_id === newProduct.product_type_id
      );

      if (existingProductIndex >= 0) {
        const updatedProducts = [...prevProducts];
        updatedProducts[existingProductIndex].quantity += quantity;
        return updatedProducts;
      } else {
        return [...prevProducts, { ...newProduct, quantity }];
      }
    });
  }, []);

  const removeProduct = useCallback((productId) => {
    setProducts((prevProducts) => {
      return prevProducts.filter(
        (product) => product.product_type_id !== productId
      );
    });
  }, []);

  const clearShoppingCart = useCallback(() => setProducts([]), []);

  return (
    <ShoppingCartContext.Provider
      value={{
        products,
        totalAmount,
        addProduct,
        removeProduct,
        clearShoppingCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};
