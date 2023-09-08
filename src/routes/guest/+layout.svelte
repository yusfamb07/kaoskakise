<script>
	import Navbar from '$components//Navbar.svelte';
	import Footer from '$components//Footer.svelte';
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" />
</svelte:head>

<body class="texture">
	<div class="bgbinda">
		<Navbar />

		<slot />

		<Footer />
	</div>
</body>

<style>
</style>
