
const socket = io();


if (navigator.geolocation) {
  navigator.geolocation.watchPosition(position => {
    socket.emit('location', {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }, err => {
    console.log(err);
  }, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  });
}
const map = L.map('map').setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "Avaneesh"
}).addTo(map);

const marker = {};

socket.on('recive-location', (data) => {
  const { id, lat, lng, hostname } = data;
  map.setView([lat, lng], 16);
  if (marker[id]) {
    marker[id].setLatLng([lat, lng]);
    marker[id].bindPopup(hostname).openPopup();
  } else {
    marker[id] = L.marker([lat, lng]).addTo(map);

  }
});

socket.on('user-disconnected', (id) => {
  if (marker[id]) {
    map.removeLayer(marker[id]);
    delete marker[id];
  }
});