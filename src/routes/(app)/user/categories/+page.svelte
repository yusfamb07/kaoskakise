<script>
  import { onMount } from "svelte";
  import { dataAPI } from "$utils/axios";
  import Pagination from "$components/Pagination.svelte";
  import Swal from "sweetalert2";
  const url_API = import.meta.env.VITE_API_SOCK;
  import { countCartBadge } from "$components/countCartBadge";
  import { updateCartCountUI } from "$components/countCartBadge";

  let page = parseInt(1),
    total,
    categories = [],
    province = "";

  async function getCategories() {
    try {
      const res = await dataAPI.get(
        `/categories/customer/all?page=${page}&record=10`
      );
      categories = res.data.data;
      total = res.data.pagination.totalPage;

      // console.log(products);
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

  onMount(async () => {
    await getCategories();
    const initialCartCount = await countCartBadge();
    updateCartCountUI(initialCartCount);
  });
</script>

<div class="container lg mx-auto">
  <h1 class="text-xl font-belanosima d-flex justify-center mt-4">CATEGORIES</h1>
  <div class="flex justify-center">
    <div class="border-b border-black border-1 w-32"></div>
  </div>
  <div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 mt-4">
    {#each categories as item}
      <a href="/user/categories/{item.cate_id}">
        <div class="card border-none">
          <!-- <img
			src="/active.jpg"
			class="card-img-top lg: w-100 lg:h-auto sm:: w-20 sm:h-auto"
			alt="..."
		  /> -->
          <img
            src={item?.cate_image
              ? `${url_API}/products/image/${item?.cate_image}`
              : "/product-default.png"}
            class="card-img-top w-100 h-80"
            alt=""
          />
          <div class=" bg-black h-35">
            <h1
              class="lg:text-2xl sm:text-xs font-nats font-black leading-6 text-center text-white px-2 py-2"
            >
              {item?.cate_name}
            </h1>
          </div>
        </div>
      </a>
      <!-- <div class="card border-none">
      <img src="/triball.jpg" class="card-img-top" alt="..." />
      <div class=" bg-black h-35">
        <h1
          class="text-2xl font-nats font-black leading-6 text-center text-white px-2 py-2"
        >
          Tribal Sock
        </h1>
      </div>
    </div>
    <div class="card border-none">
      <img src="/classic.jpg" class="card-img-top" alt="..." />
      <div class=" bg-black h-35">
        <h1
          class="text-2xl font-nats font-black leading-6 text-center text-white px-2 py-2"
        >
          Classic Sock
        </h1>
      </div>
    </div> -->
    {/each}
  </div>
  <!-- <div class="grid grid-cols-4 gap-4 mt-4">
		<div class="card border-none">
			<img src="/product.png" class="card-img-top" alt="..." />
			<div class="card-body">
				<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
					Kaos Kaki Sock Energy Ancient Stripe-Black
				</h1>
				<p class="card-text text-center">Rp 34.999</p>
			</div>
		</div>
		<div class="card border-none">
			<img src="/product.png" class="card-img-top" alt="..." />
			<div class="card-body">
				<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
					Kaos Kaki Sock Energy Ancient Stripe-Black
				</h1>
				<p class="card-text text-center">Rp 34.999</p>
			</div>
		</div>
		<div class="card border-none">
			<img src="/product.png" class="card-img-top" alt="..." />
			<div class="card-body">
				<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
					Kaos Kaki Sock Energy Ancient Stripe-Black
				</h1>
				<p class="card-text text-center">Rp 34.999</p>
			</div>
		</div>
		<div class="card border-none">
			<img src="/product.png" class="card-img-top" alt="..." />
			<div class="card-body">
				<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
					Kaos Kaki Sock Energy Ancient Stripe-Black
				</h1>
				<p class="card-text text-center">Rp 34.999</p>
			</div>
		</div>
	</div>
	<div class="grid grid-cols-4 gap-4 mt-4 mb-4">
		<div class="card border-none">
			<img src="/product.png" class="card-img-top" alt="..." />
			<div class="card-body">
				<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
					Kaos Kaki Sock Energy Ancient Stripe-Black
				</h1>
				<p class="card-text text-center">Rp 34.999</p>
			</div>
		</div>
		<div class="card border-none">
			<img src="/product.png" class="card-img-top" alt="..." />
			<div class="card-body">
				<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
					Kaos Kaki Sock Energy Ancient Stripe-Black
				</h1>
				<p class="card-text text-center">Rp 34.999</p>
			</div>
		</div>
		<div class="card border-none">
			<img src="/product.png" class="card-img-top" alt="..." />
			<div class="card-body">
				<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
					Kaos Kaki Sock Energy Ancient Stripe-Black
				</h1>
				<p class="card-text text-center">Rp 34.999</p>
			</div>
		</div>
		<div class="card border-none">
			<img src="/product.png" class="card-img-top" alt="..." />
			<div class="card-body">
				<h1 class="card-title text-2xl font-nats font-black leading-6 text-center">
					Kaos Kaki Sock Energy Ancient Stripe-Black
				</h1>
				<p class="card-text text-center">Rp 34.999</p>
			</div>
		</div>
	</div> -->

  <!-- <div class="lightbox">
		<div class="row">
			<div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
				<img
					src="/gallery1.png"
					data-mdb-img="https://mdbcdn.b-cdn.net/img/Photos/Slides/1.webp"
					alt="Table Full of Spices"
					class="w-100 mb-2 mb-md-4 shadow-1-strong"
				/>

				<img
					src="https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain1.webp"
					class="w-100 shadow-1-strong rounded mb-4"
					alt="Wintry Mountain Landscape"
				/>
			</div>

			<div class="col-lg-4 mb-4 mb-lg-0">
				<img
					src="/gallery2.png"
					class="w-100 shadow-1-strong rounded mb-4"
					alt="Mountains in the Clouds"
				/>

				<img
					src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp"
					class="w-100 shadow-1-strong rounded mb-4"
					alt="Boat on Calm Water"
				/>
			</div>

			<div class="col-lg-4 mb-4 mb-lg-0">
				<img
					src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(18).webp"
					class="w-100 shadow-1-strong rounded mb-4"
					alt="Waves at Sea"
				/>

				<img
					src="https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain3.webp"
					class="w-100 shadow-1-strong rounded mb-4"
					alt="Yosemite National Park"
				/>
			</div>
		</div>
	</div> -->
</div>

<style>
</style>
