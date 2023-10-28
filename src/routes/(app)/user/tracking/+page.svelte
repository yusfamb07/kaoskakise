<script>
    import { onMount } from 'svelte';
	import { dataAPI } from '$utils/axios';
	import Pagination from '$components/Pagination.svelte';
	import Swal from 'sweetalert2';
	const url_API = import.meta.env.VITE_API_SOCK;
	import { goto } from '$app/navigation';
    import moment from 'moment';


    let unpayment = [];
 
    let orderId = '';

    async function unPaymentTabs() {

		try {
			const res = await dataAPI.get(`carts/listUnpayment`);
			unpayment = res.data.data;

            tabs[0].content = unpayment.map(item => ({
                id_order: item.id,  
                fopa_id : item.fopa_id,
                order_number: item.order_number,  
                image: `<img src="${item.prod_image
                        ? `${url_API}/products/image/${item.prod_image}`
                        : '/product-default.png'}" class="w-44" alt="">`,
                name_product: item.prod_name,
                status_payment: item.status,
                payment_method: item.payment,
                no_rek: item.no_rek,
                end_date: item.end_date,
                price: `Rp ${Number(item.prod_price).toLocaleString('id-ID')}`,
                subtotal: `Rp ${Number(item.total).toLocaleString('id-ID')}`,
                total: `Rp ${Number(item.totalAll).toLocaleString('id-ID')}`,
                qty: item.qty,
                total_price : parseFloat(parseFloat(item.ongkir) + parseFloat(item.subtotal)),
                shipping_cost : parseFloat(item.ongkir),
                totalFloat : parseFloat(item.total),
                payment: item.payment, 
                action: `
                    <button
                        data-bs-toggle="modal"
                        data-bs-target="#transferPayment"
                        id="handleTransfer"
                        data-order= ${item?.fopa_id}
                        class="w-28 rounded-md bg-red-500 text-white font-semibold text-sm h-9 mt-2 mb-3"
                    >
                        Upload Evidence
                    </button>
                `
                
            }));
            // console.log(unpayment.total_price);
		} catch (error) {
			console.log(error);
			await Swal.fire({
				icon: 'error',
				title: 'Oops!',
				confirmButtonColor: '#596066',
				customClass: 'swal-height',
				text: 'An error occurred while fetching data'
			});
		}
	}

    let payment = [];

    async function PaymentTabs() {

		try {
			const res = await dataAPI.get(`carts/listPayment`);
			payment = res.data.data;

            tabs[1].content = payment.map(item => ({
                id_cart: item.id_cart,
                order_number: item.order_number,
                image: `<img src="${item.image
                        ? `${url_API}/products/image/${item.image}`
                        : '/product-default.png'}" class="w-44" alt="">`,
                name_product: item.name,
                subtotal: `Rp ${Number(item.total).toLocaleString('id-ID')}`,
                shipping_cost : parseFloat(item.ongkir),
                totalFloat : parseFloat(item.total),
                total_price : parseFloat(parseFloat(item.ongkir) + parseFloat(item.subtotal)),
                qty: item.qty,
            }));

		} catch (error) {
			console.log(error);
			await Swal.fire({
				icon: 'error',
				title: 'Oops!',
				confirmButtonColor: '#596066',
				customClass: 'swal-height',
				text: 'An error occurred while fetching data'
			});
		}
	}

    let cancel_order = [];

    async function CancelTabs() {

		try {
			const res = await dataAPI.get(`carts/listCancel`);
			cancel_order = res.data.data;

            tabs[4].content = cancel_order.map(item => ({
                id_cart: item.id_cart,
                order_number: item.order_number,
                image: `<img src="${item.image
                        ? `${url_API}/products/image/${item.image}`
                        : '/product-default.png'}" class="w-44" alt="">`,
                name_product: item.name,
                subtotal: `Rp ${Number(item.total).toLocaleString('id-ID')}`,
                shipping_cost : parseFloat(item.ongkir),
                totalFloat : parseFloat(item.total),
                total_price : parseFloat(parseFloat(item.ongkir) + parseFloat(item.subtotal)),
                qty: item.qty,
            }));

		} catch (error) {
			console.log(error);
			await Swal.fire({
				icon: 'error',
				title: 'Oops!',
				confirmButtonColor: '#596066',
				customClass: 'swal-height',
				text: 'An error occurred while fetching data'
			});
		}
	}

    let files;

	const submitTransfer = async (event) => {
		event.preventDefault();
		const formDataWithFile = new FormData();
		formDataWithFile.append('fopa_image_transaction', files[0]);
        console.log(formDataWithFile);
		try {
			const response = await dataAPI.post(`/carts/upload_bukti/${orderId}`, formDataWithFile);
            console.log(formDataWithFile);
			if (response.status === 200) {
					await Swal.fire({
						icon: 'success',
						title: 'Successful adding to cart',
						showConfirmButton: false,
						timer: 1500
					});
					location.reload();
                    // await PaymentTabs();
                } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
                console.log(error);
            }
		} catch (error) {
			await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
            console.log(error);
		} 
	};

   

   const handleCancel = async (event) => {
        event.preventDefault();
		const { cancelId } = event.currentTarget.dataset;

        Swal.fire({
                title: 'Do you want to cancel the order?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Save',
            }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${url_API}/carts/sendCancel/${cancelId}`, {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                location.reload()
                Swal.fire('Saved!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        }).catch((error) => {
				console.log(error);
			});
	};

    let requestTransfer = [];

    async function getDetailOrder() {
		try {
			const res = await dataAPI.post(`/carts/upload_bukti/${orderId}`);
			requestTransfer = res.data.data;
            // orderId = res.data.data.fopa_id;
		} catch (error) {
			console.log(error);
		}
	}

    let evidence = '';

    const handleEvidence = async (event) => {
        event.preventDefault();
		const { evidenceId } = event.currentTarget.dataset;
		try {
			const res = await dataAPI.get(`/carts/detailPayment/${evidenceId}`);
			evidence = res.data.data.data_payment.bukti;
            // orderId = res.data.data.fopa_id;

            console.log(evidence);
		} catch (error) {
			console.log(error);
		}
	}


    let activeTabIndex = 0;

	const tabs = [
		// { icon: `<img src="/all.svg" class="w-6 h-6 mr-3" alt="">`, 
		// title: 'Order All', content: [
          
		// ]},
        { icon: `<img src="/unpaid.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Unpayment', content: [
           
		]},
		{ icon: `<img src="/rupiah.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Payment', content: [
           
		]},
		{ icon: `<img src="/fast-delivery.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Delivery', content: [
            
		]},
        { icon: `<img src="/done.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Done', content: [
            
		]},
		{ icon: `<img src="/cancelled.png" class="w-6 h-6 mr-3" alt="">`,  
		title: 'Cancelled', content: [
           
		]}
	];

	function switchTab(index) {
		activeTabIndex = index;
	}

    function handleRowClick(item) {
        goto(`/user/tracking/${item.id_order}`);
    }

    function handleRowClickPayment(item) {
        goto(`/user/tracking/${item.id_cart}`);
    }

    onMount(async () => {
		switchTab(0);
        await unPaymentTabs();
        await PaymentTabs();
        await CancelTabs();
        
        document.querySelectorAll('#handleTransfer').forEach((el) => {
            el.addEventListener('click', () => {
                orderId = el.dataset.order;
            });
        });
        document.getElementById('transferPayment').addEventListener('shown.bs.modal', getDetailOrder);
        

	});
</script>

<div class="container">
    <div class="grid grid-cols-1">
        <h1 class="text-xl font-belanosima flex justify-center mt-4">ORDERS</h1>
        <div class="flex justify-center ">
            <div class="border-b border-black border-1  w-24"></div>
        </div>
        <div class="flex justify-center ">
            <form class="w-96 mt-1">
                <div class="flex items-center border-b border-black py-2">
                    <input
                        class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="text"
                        placeholder="Search by Product Name or No Orders "
                        aria-label="Search"
                    />
                    <button class="flex-shrink-0 bg-black text-sm text-white py-1 px-2 rounded" type="button">
                        Search
                    </button>
                </div>
            </form>
        </div>
        
    </div>
    <div class="border-b border-gray-200 mt-3">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center w-full text-gray-800 gap-3 ">
            {#each tabs as tab, index}
                <li class="mr-2">
                    <a href="" on:click={() => switchTab(index)} class="inline-flex items-center justify-center p-4  {index === activeTabIndex ? 'text-black border-b-2 border-red-500 rounded-t-lg' : 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'}
                        group" aria-current="page">
                        
                        <span class="mr-2">{@html tab.icon}</span>
                        {tab.title}
                    </a>
                </li>
            {/each}
            
        </ul>
		</div>
		<div id="panels">
			{#each tabs as tab, index}
                <div class= " mt-4 {index === activeTabIndex ? '' : 'hidden'}">
                        {#if tab.content.length > 0}
                        {#if tab.title === "Unpayment"}    
                            {#each tab.content as item}
                                    <div class="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow ">
                                        <div class="grid grid-cols-9 mt-3">
                                            <div class="col-span-8 border-b border-gray-300">
                                                <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 ">Order Number: {item?.order_number} </h5>
                                            </div>
                                            <div class="border-b border-gray-300">
                                                <h5 class="font-semibold text-xl  uppercase text-red-500 flex justify-end">{item?.status_payment}</h5>
                                                <!-- <span class="bg-green-100 text-green-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Sending</span> -->
                                            </div>
                                        </div>
                                            <div class="grid grid-cols-9 mt-3">
                                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                                <div class="col-span-8 border-b border-gray-300 cursor-pointer" on:click={() => handleRowClick(item)} >
                                                    <div class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                                        <div class=" py-2 w-full ml-5 flex items-start">
                                                        {@html item?.image}
                                                                <div>
                                                                    <p class="text-xl font-semibold text-black">{item?.name_product} <br><span class="font-medium text-base">x {item.qty}</span></p>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="border-b border-gray-300">
                                                    <h5 class="font-semibold text-xl text-red-500 flex justify-end">{item?.subtotal}</h5>
                                                </div>
                                            </div>
                                        <div class="grid grid-cols-9 mt-3">
                                            <div class="col-span-7">
                                                <div class="flex items-center">
                                                    <div class="flex-none w-32">
                                                        <div class="py-2 w-full flex items-center">
                                                            <p class="text-base font-medium">Payment Method</p>
                                                        </div>
                                                    </div>
                                                    <div class="flex-initial w-5">
                                                        <div class="py-2 mt-1">                        
                                                            <p class="text-sm font-semibold">: </p>
                                                        </div>
                                                    </div>
                                                    <div class="flex-initial w-64">
                                                        <div class="py-2 w-full ml-5 flex items-center gap-1">
                                                            <img src={item.payment_method === 'Transfer Bank'
                                                                ? '/bca.png'
                                                                : '/cod.png'} class="w-16 " alt="">
                                                            <p class="text-base font-semibold"> {item?.payment_method}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex">
                                                    <div class="flex-none w-32">
                                                        <div class="py-2 w-full flex items-start">
                                                            <p class="text-base font-medium">Rekening Number</p>
                                                        </div>
                                                    </div>
                                                    <div class="flex-initial w-5">
                                                        <div class="py-2 mt-1">                        
                                                            <p class="text-sm font-semibold">: </p>
                                                        </div>
                                                    </div>
                                                    <div class="flex-initial w-80">
                                                        <div class="py-2 w-full ml-5 flex items-start">
                                                            <p class="text-base font-semibold text-red-500">{item?.payment_method === 'Transfer Bank' ? item?.no_rek : ''}  <span class="text-black">{item.payment_method === 'Transfer Bank' ? 'A/n Yusfa Muhammad Bakran': '' } </span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-span-2">
                                                <div class="flex">
                                                    <div class="flex-none w-32">
                                                        <div class="py-2 w-full flex items-start">
                                                            <p class="text-base font-medium">Shipping Cost</p>
                                                        </div>
                                                    </div>
                                                    <div class="flex-initial w-5">
                                                        <div class="py-2 mt-1">                        
                                                            <p class="text-sm font-semibold">: </p>
                                                        </div>
                                                    </div>
                                                    <div class="flex-initial w-32">
                                                        <div class="py-2 w-full ml-5 flex items-start">
                                                            <p class="text-base font-semibold">{`Rp ${Number(item.shipping_cost).toLocaleString('id-ID')}`}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex">
                                                    <div class="flex-none w-32">
                                                        <div class="py-2 w-full flex items-start">
                                                            <p class="text-base font-medium">Total</p>
                                                        </div>
                                                    </div>
                                                    <div class="flex-initial w-5">
                                                        <div class="py-2 mt-1">                        
                                                            <p class="text-sm font-semibold">: </p>
                                                        </div>
                                                    </div>
                                                    <div class="flex-initial w-32">
                                                        <div class="py-2 w-full ml-5 flex items-start">
                                                            <p class="text-xl font-semibold text-red-500">{`Rp ${Number(parseFloat(item.totalFloat + item.shipping_cost)).toLocaleString('id-ID')}`}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {#if item?.payment_method === 'Transfer Bank'} 

                                                    <div class="flex justify-end gap-2">
                                                        <button
                                                            id="handleDelete"
                                                            data-cancel-id={item.fopa_id}
                                                            on:click={handleCancel}
                                                            class="w-28  font-base  h-9 mt-2 mb-3 rounded-md border text-black font-base text-sm hover:underline  hover:bg-slate-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        {@html item.action}
                                                        
                                                    </div>
                                                    <div class="py-2 w-full flex justify-end">
                                                        <p class="text-sm font-medium">Pay before {item?.end_date} with BCA Bank</p>
                                                    </div>
                                                {/if}
                                                
                                            </div>
                                        </div>
                                    </div>
                                    {/each}
                                {:else if tab.title === "Payment"}
                                    {#each tab.content as item}
                                        <div class="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow mt-3">

                                       <div class="grid grid-cols-9 mt-3">
                                            <div class="col-span-8 border-b border-gray-300">
                                                <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 ">Order Number: {item?.order_number} </h5>
                                            </div>
                                            <div class="border-b border-gray-300">
                                                <!-- <h5 class="font-semibo ld text-xl  uppercase text-red-500 flex justify-end">{item?.status_payment}</h5> -->
                                            </div>
                                        </div>
                                            <div class="grid grid-cols-9 mt-3">
                                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                                <div class="col-span-8 border-b border-gray-300 cursor-pointer" on:click={() => handleRowClickPayment(item)} >
                                                    <div class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                                        <div class=" py-2 w-full ml-5 flex items-start">
                                                        {@html item?.image}
                                                                <div>
                                                                    <p class="text-xl font-semibold text-black">{item?.name_product} <br><span class="font-medium text-base">x {item.qty}</span></p>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="border-b border-gray-300">
                                                     <p class="text-2xl font-semibold text-red-500">{`Rp ${Number(parseFloat(item.totalFloat + item.shipping_cost)).toLocaleString('id-ID')}`}</p>
                                                </div>
                                            </div>
                                            <div class="flex justify-end">
                                                <button
                                                    id="handleDelete"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#evidenceModal"
                                                    data-evidence-id={item.id_cart}
                                                    on:click={handleEvidence}
                                                    class="w-28  font-base  h-9 mt-2 mb-3 rounded-md border text-black font-base text-sm hover:underline  hover:bg-slate-50"
                                                >
                                                    Show Evidence
                                                </button>
                                                
                                            </div>
                                       </div>
                                    {/each}
                                {:else}
                                    {#each tab.content as item}
                                        <div class="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow mt-3">

                                       <div class="grid grid-cols-9 mt-3">
                                            <div class="col-span-8 border-b border-gray-300">
                                                <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900 ">Order Number: {item?.order_number} </h5>
                                            </div>
                                            <div class="border-b border-gray-300">
                                                <!-- <h5 class="font-semibo ld text-xl  uppercase text-red-500 flex justify-end">{item?.status_payment}</h5> -->
                                            </div>
                                        </div>
                                            <div class="grid grid-cols-9 mt-3">
                                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                                <div class="col-span-8 border-b border-gray-300 cursor-pointer" on:click={() => handleRowClickPayment(item)} >
                                                    <div class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                                        <div class=" py-2 w-full ml-5 flex items-start">
                                                        {@html item?.image}
                                                                <div>
                                                                    <p class="text-xl font-semibold text-black">{item?.name_product} <br><span class="font-medium text-base">x {item.qty}</span></p>
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="border-b border-gray-300">
                                                     <p class="text-2xl font-semibold text-red-500">{`Rp ${Number(parseFloat(item.totalFloat + item.shipping_cost)).toLocaleString('id-ID')}`}</p>
                                                </div>
                                            </div>
                                            <div class="flex justify-end">
                                                <button
                                                    id="handleDelete"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#evidenceModal"
                                                    data-evidence-id={item.id_cart}
                                                    on:click={handleEvidence}
                                                    class="w-28 rounded-md bg-red-500 text-white font-semibold text-sm h-9 mt-2 mb-3"
                                                >
                                                    Buy Again
                                                </button>
                                                
                                            </div>
                                       </div>
                                    {/each}
                                {/if}
                        {:else}
                            <div class="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow ">
                                <div class="flex justify-center items-center">
                                    <img class="w-48 px-3 py-3" src="/empty-logo.png" alt="">
                                </div>
                                <div class="flex justify-center items-center">
                                    <h4 class=" text-center text-base  font-semibold uppercase text-gray-800">Data is Empty</h4>
                                </div>
                                <div class="flex justify-center items-center mb-3">
                                    <p class="text-gray-600 text-sm">Please order the product</p>
                                </div>  
                            </div>          
                        {/if}
                </div>
            {/each}
		</div>

    <div
        class="modal fade"
        id="transferPayment"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-body">
                   <div class="container">
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload file</label>
                        <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 " type="file"  bind:files>
                   </div>
                   
                    <div class="flex justify-center">
                        <button on:click={submitTransfer}
                            data-bs-dismiss="modal"
                            class=" w-72 rounded-md bg-red-500 text-white font-semibold text-base h-9 mt-3 mb-3 "
                            >Upload Evidence
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div
        class="modal fade"
        id="evidenceModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" data-bs-dismiss="modal" aria-label="Close" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span class="sr-only">Close menu</span>
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                   
                    <div class="flex justify-center">
                        <img
                            src={evidence
                            ? `${url_API}/products/image/${evidence}`
                            : '/product-default.png'}
                            class="lg:w-72 sm:w-52 px-3 py-1"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
   
</div>