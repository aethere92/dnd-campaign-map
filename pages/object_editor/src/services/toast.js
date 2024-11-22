function showToast(message, type = 'success') {
	const toast = document.createElement('div');
	toast.className = `toast ${type}`;
	toast.textContent = message;

	const container = document.getElementById('toast-container');
	container.appendChild(toast);

	setTimeout(() => {
		toast.style.animation = 'slideOut 0.3s ease';
		setTimeout(() => toast.remove(), 300);
	}, 3000);
}
