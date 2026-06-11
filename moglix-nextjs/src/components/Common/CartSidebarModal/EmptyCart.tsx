import Link from "next/link";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { ShoppingBag } from "lucide-react";


const EmptyCart = () => {
  const { closeCartModal } = useCartModalContext();

  return (
    <div className="text-center">
      <div className="mx-auto pb-7.5">
      <div className="mx-auto pb-7.5 text-dark-4/20">
        <ShoppingBag size={80} strokeWidth={1} className="mx-auto" />
      </div>

      </div>

      <p className="pb-6">Your cart is empty!</p>

      <Link
        onClick={() => closeCartModal()}
        href="/shop-with-sidebar"
        className="w-full lg:w-10/12 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
