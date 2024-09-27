import { useState } from "react";
import { ShoppingCartIcon } from "./icons";
import { useShoppingCart } from "../hooks";
import ShoppingCart from "./shopping-cart";
import { Link } from "react-router-dom";
export default function Navbar(){
  const [showCart, setShowCart] = useState(false);
  const { products } = useShoppingCart();
  return(
      <nav className="min-h-[10vh] flex justify-between p-2" style={{backgroundColor:"#FFFFFF"}}>
          <Link to="/">
            <img src={"/logo-3.png"} alt="logo fia fit" className="w-[30vh] h-[10vh]" />
          </Link>
          <div className="flex flex-row items-center mr-4 gap-20">
              <Link to="/">
                <h1 className="text-[20px] font-bold" style={{color:"#4B4F57"}}>Inicio</h1>
              </Link>
              <Link to="/productos">
                <h1 className="text-[20px] font-bold" style={{color:"#4B4F57"}}>´Productos</h1>
              </Link>
              <div className="relative flex items-center">
          <button
            className="hover:bg-slate-200/20 rounded-full p-2 text-white flex items-center gap-1"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCartIcon />
            <div className="bg-gray p-1 text-xs text-gray-900 w-6 h-6 rounded-[50%]">
              <span>{products.length}</span>
            </div>
          </button>
          {showCart && (
            <div className="absolute top-12 right-0 w-max">
              <ShoppingCart />
            </div>
          )}
        </div>
          </div>
      </nav>
  )
}
