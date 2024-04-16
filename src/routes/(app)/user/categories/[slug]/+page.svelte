<script>
  import { onMount } from "svelte";
  import { dataAPI } from "$utils/axios";
  import Pagination from "$components/Pagination.svelte";
  import Swal from "sweetalert2";
  const url_API = import.meta.env.VITE_API_SOCK;
  import { countCartBadge } from "$components/countCartBadge";
  import { updateCartCountUI } from "$components/countCartBadge";
  import { Alert } from "flowbite-svelte";
  import { page } from "$app/stores";

  let slug = $page.params.slug;

  let detailcategories = [];
  let products = [];
  let namecategories = "";
  async function fetchDetailCategories() {
    try {
      const response = await dataAPI.get(`/categories/customer/${slug}`);
      detailcategories = response.data.data;
      products = response.data.data.products;
      namecategories = response.data.data.cate_name;
      console.log(detailcategories);
    } catch (error) {
      console.log(error);
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        confirmButtonColor: "#596066",
        customClass: "swal-height",
        text: "An error occurred while fetching data",
      });
    }
  }

  async function AddToCart(e) {
    const { prodId } = e.currentTarget.dataset;
    fetch(`${url_API}/carts/addCarts`, {
      method: "POST",
      body: JSON.stringify({
        cart_qty: qty,
        cart_prod_id: prodId,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(async (response) => {
      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Successful adding to cart",
          showConfirmButton: false,
          timer: 1500,
        });

        await getProduct();
        bootstrap.Modal.getInstance(
          document.getElementById("DetailProduct")
        ).hide();
        const updatedCartCount = await countCartBadge();
        updateCartCountUI(updatedCartCount);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        console.log(error);
      }
    });
  }

  let search = null;

  async function searchProducts() {
    products = null;

    try {
      const res = await fetch(
        `${url_API}/products/customer/search?page=${page}&record=10`,
        {
          method: "POST",
          body: JSON.stringify({
            search: `%${search}%`,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((res) => res.json());
      products = res.data;
      total = res.pagination.totalPage;
    } catch (error) {
      console.log(error);
    }
  }

  let detailproduct = [];
  let detailrating = [];
  async function fetchDetailProduct(e) {
    const { prodId } = e.currentTarget.dataset;
    try {
      const response = await dataAPI.get(
        `/products/customer/detailProducts/${prodId}`
      );
      detailproduct = response.data.data;
      detailrating = response.data.data[0].ratings;

      starCount = detailrating.length > 0 ? detailrating[0].rat_count : 0;

      console.log(detailrating, "detail rating");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        confirmButtonColor: "#596066",
        customClass: "swal-height",
        text: "An error occurred while fetching data",
      });
    }
  }

  const handlePageChange = (e) => {
    page = e.detail;
    getProduct();
  };

  function handleSearchSubmitEnter(event) {
    if (event.key === "Enter") {
      searchProducts();
    }
  }

  let qty = 1;

  function increment() {
    qty += 1;
  }

  function decrement() {
    if (qty > 0) {
      qty -= 1;
    }
  }

  function handleRadioChange(event, index) {
    detailrating[index].selectedRating = +event.target.value;
    console.log(
      "New star rating for index " +
        index +
        ": " +
        detailrating[index].selectedRating
    );
  }

  $: averageRating = calculateAverageRating();

  function calculateAverageRating() {
    const totalStars = detailrating.reduce(
      (acc, { rat_count }) => acc + rat_count,
      0
    );
    const averageRating = totalStars / detailrating.length;
    return isNaN(averageRating) ? 0 : averageRating; // Default to 0 if NaN
  }

  let starCount = 0;

  function createStars(count) {
    let stars = "";
    for (let i = 0; i < count; i++) {
      stars += "⭐"; // Simbol bintang
    }
    return stars;
  }

  onMount(async () => {
    await fetchDetailCategories();
    const initialCartCount = await countCartBadge();
    updateCartCountUI(initialCartCount);
  });
</script>

<div class="container lg mx-auto">
  <h1 class="text-xl font-belanosima flex justify-center mt-4 gap-4">
    <a href="/user/categories/">
      <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fill-rule="evenodd"
          d="M13.729 5.575c1.304-1.074 3.27-.146 3.27 1.544v9.762c0 1.69-1.966 2.618-3.27 1.544l-5.927-4.881a2 2 0 0 1 0-3.088l5.927-4.88Z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
    {namecategories}
  </h1>
  <div class="flex justify-center">
    <div class="border-b border-black border-1 w-36"></div>
  </div>

  <div class="grid lg:grid-cols-4 sm:grid-cols-2 gap-5 mt-4">
    {#each products as post}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="card border-none cursor-pointer"
        data-bs-toggle="modal"
        data-bs-target="#DetailProduct"
        data-prod-id={post?.prod_id}
        on:click={fetchDetailProduct}
      >
        <img
          src={post.prod_image
            ? `${url_API}/products/image/${post?.prod_image}`
            : "/product-default.png"}
          class="w-80 h-72"
          alt=""
        />
        <!-- <img src="/product.png" class="card-img-top " alt="..." /> -->
        <div class="card-body">
          <h1
            class="card-title text-2xl font-nats font-semibold leading-6 text-center"
          >
            {post?.prod_name}
          </h1>
          <p class=" text-lg text-center font-medium">
            {`Rp ${Number(post.prod_price).toLocaleString("id-ID")}`}
          </p>
        </div>
      </div>
    {/each}
  </div>
</div>

<div
  class="modal fade"
  id="DetailProduct"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div
    class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl"
  >
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title font-bold text-xl" id="exampleModalLabel">
          Detail Product
        </h3>
        <button
          type="button"
          data-bs-dismiss="modal"
          aria-label="Close"
          class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span class="sr-only">Close menu</span>
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="grid grid-cols-2 gap-2">
          {#each detailproduct as post}
            <div class="flex justify-center items-center">
              <img
                src={post.prod_image
                  ? `${url_API}/products/image/${post?.prod_image}`
                  : "/product-default.png"}
                class="w-96"
                alt=""
              />
            </div>
            <div class="content-between">
              <div class="">
                <h1 class="text-xl font-bold">{post?.prod_name}</h1>
                <h1
                  class="font-semibold text-2xl text-red-400 whitespace-normal mt-3"
                >
                  {`Rp ${Number(post.prod_price).toLocaleString("id-ID")}`}
                </h1>
                <div class="flex justify-start items-center gap-5 mt-3">
                  <h1 class="font-semibold text-xl">Quantity</h1>
                  <div class="flex justify-center gap-1">
                    <img
                      on:click={decrement}
                      src="/remove.svg"
                      alt=""
                      class="w-4 cursor-pointer"
                    />
                    <p
                      class="text-base font-xl text-gray-900 whitespace-normal"
                    >
                      {qty}
                    </p>
                    <img
                      on:click={increment}
                      src="/add.svg"
                      alt=""
                      class="w-4 cursor-pointer"
                    />
                  </div>
                  <h1 class="font-medium text-base text-gray-500">
                    {post?.prod_stock} stock
                  </h1>
                  <input type="text" bind:value={qty} class="invisible" />
                </div>
                <div class="mt-3">
                  <h1 class="font-semibold text-xl">Description</h1>
                  <div class="border-b border-1 border-black mt-1"></div>
                  <p
                    class="text-sm font-medium whitespace-normal break-all mt-2"
                  >
                    {@html post?.prod_desc}
                  </p>
                </div>
                <div class="mt-3">
                  <!-- {#each detailrating as { rat_count, rat_desc, selectedRating }, index}
                    <div class="rating">
                      <label>
                        <input
                          type="radio"
                          name={"stars_" + index}
                          value={1}
                          on:change={(event) => handleRadioChange(event, index)}
                          bind:group={selectedRating}
                        />
                        {#each Array(5) as _, i}
                          <span class="icon">{i < rat_count ? "★" : "☆"}</span>
                        {/each}
                      </label>
                    </div>
                  {/each} -->
                  {#if starCount}
                    <p>{createStars(starCount)}</p>
                    <div
                      class="mt-1 bg-red-50 text-red-800 rounded-lg border-red-300 divide-red-300 p-2 gap-3 text-xs"
                      role="alert"
                    >
                      <span class="font-medium p-1 s-RvR3GHrKNK01"
                        >Attention!</span
                      >
                      Rating is taken based on the latest assessment
                    </div>
                  {/if}
                </div>
              </div>
              <div class="mt-5">
                <button
                  type="submit"
                  on:click={AddToCart}
                  data-prod-id={post?.prod_id}
                  class=" w-full rounded-md bg-red-500 text-white font-semibold text-base h-9 mt-5"
                  >ADD TO CART</button
                >
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    height: 35px;
    width: 35px;
    outline: black;
    background-size: 100%, 100%;
    border-radius: 50%;
    background-image: none;
    background-color: black;
  }

  .carousel-control-next-icon:after {
    content: ">";
    font-size: 20px;
    color: white;
  }

  .carousel-control-prev-icon:after {
    content: "<";
    font-size: 20px;
    color: white;
  }
</style>
