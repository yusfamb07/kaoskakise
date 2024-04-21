<script>
  import { onMount } from "svelte";
  import { dataAPI } from "$utils/axios";
  import Pagination from "$components/Pagination.svelte";
  import { Tooltip } from "flowbite-svelte";
  import { writable } from "svelte/store";

  let csrfToken = writable("");

  let page = parseInt(1);
  let total;
  let about = [];
  let about_main = "";
  async function fetchAbout() {
    try {
      const res = await dataAPI.get(`/about/allAbout`);
      about = res.data.data;
      about_main = res.data.data[0];

      // total = res.data.pagination.totalPage;
    } catch (error) {
      console.log(error);
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }
  const url_API = import.meta.env.VITE_API_SOCK;
  const url_API_XSRF = import.meta.env.VITE_API_SOCK_XSRF;

  // Function to fetch XSRF token from the server
  async function fetchXSRF() {
    try {
      const response = await fetch(url_API + "/csrf/get-csrf-token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Add any other headers as needed
        },
      });

      if (response.status === 500) {
        const data = await response.json();
        console.log(data.csrfToken);
        return data.csrfToken;
      } else {
        throw new Error("Failed to fetch XSRF token");
      }
    } catch (error) {
      console.error("Error fetching XSRF token:", error);
      throw error; // Propagate the error to the caller
    }
  }

  let abt_title = "";
  let abt_desc = "";
  let abt_long = "";
  let abt_lat = "";
  let gall_id = "";
  let cate_id = "";
  let abt_image = [];

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Fetch CSRF token
    const XSRFToken = await fetchXSRF(); // Assuming fetchXSRF() retrieves the CSRF token

    const formDataUpload = new FormData();
    formDataUpload.append("abt_title", abt_title);
    formDataUpload.append("abt_desc", abt_desc);
    formDataUpload.append("abt_image", abt_image.files[0]);
    formDataUpload.append("abt_lat", abt_lat);
    formDataUpload.append("abt_long", abt_long);

    try {
      const response = await fetch(url_API + "/about/createAbout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-CSRF-Token": XSRFToken, // Include CSRF token in the headers
        },
        body: formDataUpload,
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Your about has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        location.reload();
      } else {
        throw new Error("Failed to save about");
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.error(error);
    }
  };

  const handlePageChange = (e) => {
    page = e.detail;
    fetchFolder();
  };

  const handleFileChange = (event) => {
    abt_image = event.target.files[0];
  };

  let updData = {};

  async function handleUpdateData(e) {
    const { cateId } = e.currentTarget.dataset;
    try {
      const response = await dataAPI.get(`/about/admin/${cateId}`);
      updData = response.data.data[0];
      cate_id = updData.gall_id;
      gall_name = updData.gall_name;
      abt_image = updData.abt_image;
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log(error);
    }
  }

  let cate_image_update = [];

  const updateData = async (event) => {
    event.preventDefault();

    const formDataWithFile = new FormData();
    formDataWithFile.append("gall_name", gall_name);
    formDataWithFile.append("abt_image", cate_image_update.files[0]);

    const { cateId } = event.currentTarget.dataset;

    try {
      const response = await dataAPI.post(
        `/about/admin/edit/${cateId}`,
        formDataWithFile
      );

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Your about has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        location.reload();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        console.log(error);
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log(error);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const { cateId } = event.currentTarget.dataset;

    fetch(`${url_API}/about/admin/${cateId}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (response) => {
        console.log(response);
        // console.log(user_status_id);
        if (response.status === 200) {
          Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this folder?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then((result) => {
            if (result.isConfirmed) {
              fetch(`${url_API}/about/delete/${cateId}`, {
                method: "DELETE",

                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
              Swal.fire({
                icon: "success",
                title: "Your about has been saved",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
          // location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onMount(async () => {
    await fetchAbout();
    // await fetchXSRF();
    // await fetchGalerry();
    // await addValue();
    // new DataTable('#categorieslist', {
    // 	ordering: true,
    // 	lengthChange: true,
    // 	searching: true,
    // 	paging: true
    // });
  });
</script>

<div class="p-4 mt-4 sm:ml-64">
  <div
    class="p-4 border-2 border-gray-200 border-dashed rounded-md dark:border-gray-700 mt-14"
  >
    <div class="grid grid-cols-2 gap-3">
      <div class="">
        <div class="flex justify-between">
          <h1 class="text-lg font-bold text-color underline">About</h1>
          <!-- {#if about.length < 1}
            <button
              class="rounded-md bg-red-500 px-2 py-2 text-white focus:outline-none focus:shadow-outline"
              data-bs-toggle="modal"
              data-bs-target="#AddModal">Add About</button
            >
          {:else}
            <button
              class="rounded-md bg-red-500 px-2 py-2 text-white focus:outline-none focus:shadow-outline"
              data-bs-toggle="modal"
              data-bs-target="#AddModal">Edit About</button
            >
          {/if} -->
          <button
            class="rounded-md bg-red-500 px-2 py-2 text-white focus:outline-none focus:shadow-outline"
            data-bs-toggle="modal"
            data-bs-target="#AddModal">Add About</button
          >
        </div>

        <div class="table-container" style="overflow-x: auto; width: 100%;">
          <table
            id="categorieslist"
            class="table table-auto border border-1 mt-4 rounded-sm"
          >
            <thead class="border border-1 rounded-md">
              <tr>
                <th class="">No</th>
                <th class="">Title</th>
                <th class="w-72">Description</th>
                <th class="">Latitude</th>
                <th class="">Longitude</th>
                <th class="">Image</th>
              </tr>
            </thead>
            <tbody>
              {#if about}
                {#each about as post, i}
                  <tr>
                    <td>{++i}</td>
                    <td>{post?.abt_title}</td>
                    <td
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={post?.abt_desc}
                      >{post?.abt_desc.slice(0, 200) + "..."}</td
                    >

                    <td>{post?.abt_lat}</td>
                    <td>{post?.abt_long}</td>
                    <td
                      ><img
                        src={post.abt_image
                          ? `${url_API}/products/image/${post?.abt_image}`
                          : "/product-default.png"}
                        class="w-28 h-28"
                        alt=""
                      /></td
                    >
                  </tr>
                {/each}
              {:else}
                <tr>
                  <td colspan="6">
                    <div
                      class="loader-container m-0 h-100 gap-3 d-flex align-items-center justify-content-center"
                    >
                      <div class="custom-loader" />
                      <h4 class="text-black load-title">Loading....</h4>
                    </div>
                  </td>
                </tr>
              {/if}
            </tbody>
          </table>
        </div>

        <div class="div">
          <Pagination
            currentPage={page}
            totalPages={total}
            on:currentPageChange={handlePageChange}
          />
        </div>
      </div>
      <div class="">
        <div class="container">
          <h1 class="text-xl font-belanosima d-flex justify-start mt-4">
            Preview About Us
          </h1>
          <div class="flex justify-start">
            <div class="border-b border-black border-1 w-28"></div>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-3">
            <div class="col-span-2">
              <h1 class="text-xl font-semibold">{about_main?.abt_title}</h1>
              <p class="break-all mt-3">
                {about_main?.abt_desc}
              </p>
            </div>
            <div>
              <img
                src={about_main.abt_image
                  ? `${url_API}/products/image/${about_main?.abt_image}`
                  : "/product-default.png"}
                class="w-96"
                alt=""
              />
            </div>
          </div>
          <div class="grid grid-cols-1"></div>
        </div>
        <div class="mapouter">
          <div class="gmap_canvas">
            <iframe
              class="gmap_iframe"
              width="100%"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
              src="https://maps.google.com/maps?width=1256&amp;height=500&amp;hl=en&amp;q=GROSIR KAOS KAKI DEPOK SOCKENERGY&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            ></iframe><a href="https://connectionsgame.org/"
              >Connections Unlimited</a
            >
          </div>
          <style>
            .mapouter {
              position: relative;
              text-align: right;
              width: 100%;
              height: 500px;
            }
            .gmap_canvas {
              overflow: hidden;
              background: none !important;
              width: 100%;
              height: 500px;
            }
            .gmap_iframe {
              height: 500px !important;
            }
          </style>
        </div>
      </div>
    </div>
  </div>
</div>
<div
  class="modal fade"
  id="AddModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">Add About</h5>
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
      <form on:submit={handleSubmit}>
        <div class="modal-body">
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-6">
              <label
                for="product-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >About Name</label
              >
              <input
                type="text"
                id="product-input"
                placeholder="Please input your about name"
                bind:value={abt_title}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-6">
              <label
                for="product-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >About Desc</label
              >
              <textarea
                name="abt-desc"
                id="abt-desc"
                bind:value={abt_desc}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-6">
              <label
                for="product-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Lattitude</label
              >
              <input
                type="text"
                id="product-input"
                placeholder="Please input your about name"
                bind:value={abt_lat}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-6">
              <label
                for="product-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Longtitude</label
              >
              <input
                type="text"
                id="product-input"
                placeholder="Please input your about name"
                bind:value={abt_long}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1">
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="default_size">Upload Image About</label
            >
            <input
              bind:this={abt_image}
              class="block w-full mb-5 text-md px-2 py-1 text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="default_size"
              type="file"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            data-bs-dismiss="modal"
            aria-label="Close"
            class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >Cancel</button
          >
          <button
            type="submit"
            class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900"
            >Save About</button
          >
        </div>
      </form>
    </div>
  </div>
</div>

<!-- <div
  class="modal fade"
  id="EditModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title font-bold" id="exampleModalLabel">Edit About</h5>
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
      <form>
        <div class="modal-body">
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-6">
              <label
                for="product-input"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >About Name</label
              >
              <input
                type="text"
                id="product-input"
                placeholder="Please input your about name"
                bind:value={gall_name}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div class="grid grid-cols-1">
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                for="default_size">Upload Image About</label
              >
              <input
                bind:this={cate_image_update}
                class="block w-full mb-5 text-md px-2 py-1 text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="default_size"
                type="file"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            data-bs-dismiss="modal"
            aria-label="Close"
            class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >Cancel</button
          >
          <button
            type="submit"
            data-cate-id={cate_id}
            on:click={updateData}
            class="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-3 py-2 mr-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900"
            >Update About</button
          >
        </div>
      </form>
    </div>
  </div>
</div> -->

<style>
  th {
    background-color: rgb(209 213 219);
  }
</style>
