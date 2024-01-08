import { dataAPI } from "$utils/axios";

export async function countCart() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const res = await dataAPI.get(`carts/showCarts`);
      const carts = res.data.data.result.length;

      console.log(carts);

      return carts; // Return the count of carts
    } catch (error) {
      console.error(error);
      // Rest of the error handling...
    }
  } else {
    console.log("tidak ada token");
    return 0; // Return a default value when there is no token
  }
}

export function updateCartCountUI(newCartCount) {
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = newCartCount;
  }
}
