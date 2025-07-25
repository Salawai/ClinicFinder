let clinicData = [];
let map;
let markers = [];

window.onload = () => {
  fetch('./clinics.json')
    .then(res => res.json())
    .then(data => {
      clinicData = data;
      console.log("Clinic data loaded:", clinicData);

      // Initialize map centered on Austin as default
      map = L.map('map').setView([30.2672, -97.7431], 10);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
    })
    .catch(err => {
      console.error("Failed to load clinic data:", err);
    });
};

function searchClinics() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const results = document.getElementById("results");
  results.innerHTML = "";

  // Clear previous markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const filtered = clinicData.filter(c =>
    (c.city && c.city.toLowerCase().includes(input)) ||
    (c.zip && c.zip.toLowerCase().includes(input))
  );

  if (filtered.length === 0) {
    results.innerHTML = "<p>No clinics found.</p>";
    return;
  }

  filtered.forEach(c => {
    // Add clinic info to the page
    const div = document.createElement("div");
    div.className = "clinic";
    div.innerHTML = `
      <strong>${c.name}</strong><br/>
      ${c.address}<br/>
      <em>${c.hours}</em><br/>
      Services: ${c.services.join(", ")}
    `;
    results.appendChild(div);

    // Add marker to map if coordinates are available
    if (c.lat && c.lng) {
      const marker = L.marker([c.lat, c.lng])
        .addTo(map)
        .bindPopup(`<strong>${c.name}</strong><br>${c.address}`);
      markers.push(marker);
    }
  });

  // Center map to first result if available
  if (filtered[0].lat && filtered[0].lng) {
    map.setView([filtered[0].lat, filtered[0].lng], 12);
  }
}
