// Safar Leaflet Map Integrations — Real interactive maps of Uzbekistan
// Uses CartoDB Voyager tiles to match Safar's plaster/sand theme.

// 1. Auth Page Map (illustrative, static but real)
window.initAuthMap = function (elementId, highlightCity) {
  const map = L.map(elementId, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    dragPan: false,
    dragging: false,
    touchZoom: false
  }).setView([40.7, 65.2], 5.6);

  // Load clean high-res tiles using Esri World Topo Map (No API key, no 403 blocks, no watermarks)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '&copy; Esri &mdash; GIS Community'
  }).addTo(map);

  setTimeout(() => { map.invalidateSize(); }, 300);

  const CITIES = [
    { name: "Tashkent", coords: [41.2995, 69.2401] },
    { name: "Samarkand", coords: [39.6508, 66.9654] },
    { name: "Bukhara", coords: [39.7747, 64.4286] },
    { name: "Khiva", coords: [41.3784, 60.3639] },
    { name: "Nukus", coords: [42.4608, 59.6166] },
    { name: "Chimgan", coords: [41.5622, 70.0163] }
  ];

  CITIES.forEach(city => {
    const isHighlighted = city.name === highlightCity;
    const icon = L.divIcon({
      html: `<div class="custom-marker ${isHighlighted ? 'active' : ''}"><div class="marker-pulse"></div><div class="marker-dot"></div></div>`,
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const marker = L.marker(city.coords, { icon: icon }).addTo(map);
    marker.bindTooltip(city.name, {
      permanent: true,
      direction: 'right',
      className: 'city-marker-label',
      offset: [10, 0]
    });
  });

  return map;
};

// 2. Stays Page Map (fully interactive, bounds-fitted, card-synchronized)
window.initStaysMap = function (elementId, initialStays, onMarkerSelect) {
  const map = L.map(elementId, {
    zoomControl: true,
    attributionControl: false
  }).setView([40.7, 65.2], 5.8);

  // Load clean high-res tiles using Esri World Topo Map (No API key, no 403 blocks, no watermarks)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '&copy; Esri &mdash; GIS Community'
  }).addTo(map);

  setTimeout(() => { map.invalidateSize(); }, 300);

  let markersGroup = L.layerGroup().addTo(map);
  let stayMarkers = {};

  function createPopupContent(stay) {
    return `
      <div class="map-popup-card">
        <img src="${stay.image}" alt="${stay.title}">
        <div class="map-popup-body">
          <div class="map-popup-tag">${stay.tag} in ${stay.city}</div>
          <h4 class="map-popup-title">${stay.title}</h4>
          <div class="map-popup-footer">
            <div class="map-popup-rating"><span>★</span> ${stay.rating}</div>
            <div class="map-popup-price">${stay.price} <span style="font-weight:500;opacity:0.6;font-size:11px;">/ person</span></div>
          </div>
        </div>
      </div>
    `;
  }

  function renderMarkers(staysList) {
    markersGroup.clearLayers();
    stayMarkers = {};

    if (!staysList || staysList.length === 0) return;

    const bounds = [];

    staysList.forEach(stay => {
      if (!stay.coordinates) return;

      const icon = L.divIcon({
        html: `<div class="custom-marker" id="marker-stay-${stay.id}"><div class="marker-pulse"></div><div class="marker-dot"></div></div>`,
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker(stay.coordinates, { icon: icon });
      marker.bindPopup(createPopupContent(stay), {
        maxWidth: 250,
        minWidth: 250,
        offset: [0, -10]
      });

      marker.on('click', () => {
        if (onMarkerSelect) onMarkerSelect(stay);
      });

      marker.addTo(markersGroup);
      stayMarkers[stay.id] = marker;
      bounds.push(stay.coordinates);
    });

    // Auto-fit bounds if we have multiple markers
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 8);
    }
  }

  // Initial render
  renderMarkers(initialStays);

  return {
    map: map,
    updateMarkers: function (newStays) {
      renderMarkers(newStays);
    },
    highlightStay: function (stayId) {
      // Remove active class from all markers in DOM
      document.querySelectorAll('.custom-marker').forEach(el => el.classList.remove('active'));

      const marker = stayMarkers[stayId];
      if (marker) {
        const stay = initialStays.find(s => s.id === stayId);
        if (stay && stay.coordinates) {
          map.setView(stay.coordinates, 8, { animate: true });
        }
        marker.openPopup();
        
        // Add active class to the specific marker's DOM element
        setTimeout(() => {
          const el = document.getElementById(`marker-stay-${stayId}`);
          if (el) el.classList.add('active');
        }, 100);
      }
    }
  };
};
