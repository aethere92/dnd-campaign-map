const markerButton = document.querySelector('[data-role="toggle-markers"]');
markerButton.addEventListener('click', (e) => {
    const markers = document.querySelectorAll('.custom-marker-class');
    markers.forEach((marker) => marker.classList.toggle('marker-text-shown'));
});
