<template>
	<header class="custom-header">
		<div class="header-container">
			<h1 class="header-title">Space-X Rocket</h1>
		</div>
	</header>
</template>

<style scoped>
	.custom-header {
		position: sticky !important;
		top: 0;
		z-index: 50;
		background-color: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
		transition: background-color 0.3s ease;
		width: 100%;
	}
	.header-container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 12px 16px;
		display: flex;
		align-items: center;
	}

	.header-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
	}
</style>