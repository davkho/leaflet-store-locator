
  
  /*==========  preparo elementi pagina  ==========*/

  var listings = document.getElementById('listings');
  function setActive(el) {
    var siblings = listings.getElementsByTagName('div');
    for (var i = 0; i < siblings.length; i++) {
      siblings[i].className = siblings[i].className
      .replace(/active/, '').replace(/\s\s*$/, '');
    }

    el.className += ' active';
  }

  /*==========  preparo mappa  ==========*/


  var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  });

  var map = L.map('map', {
    scrollWheelZoom: false,
    center: [38.909671288923, -77.034084142948],
    zoom: 16
  });


  /*==========  carico dati creando un geoJSON layer and GO!!!  ==========*/

  // carico geojson su geojson layer
  // var geojsonFeature = './sweetgreen.geojson';
  var locations = L.geoJson(geojsonFeature, {
    pointToLayer: function(feature, latlng) {
  
  // creo variabili con icone da utilizzare dopo
  // utilizzo il plugin maki-icons per leaflet
  var purpleIcon = L.MakiMarkers.icon({icon: "rocket", color: "#b0b", size: "m"});
  var blueIcon = L.MakiMarkers.icon({icon: "fast-food", color: "#2D3CCC", size: "m"});
  console.log(feature);

  // filtro features 
  if (feature.properties.state == 'PA')
    return L.marker(latlng, {icon: blueIcon});
  else
    return L.marker(latlng, {icon: purpleIcon});
}
}).addTo(map);


/*==========  aggiungo funzionalità alle features create  ==========*/
// nota che rispetto ad altri esempi di mapbox devo farlo in due tempi
// visto che non ho le funzioni adeguate
// ora prima creo delle features
// e poi ciclando sul layer che le contiene gli aggiungo le funzionalità che voglio 
locations.eachLayer(function  (e) {
    // Shorten locale.feature.properties to just `prop` so we're not
      // writing this long form over and over again.
      var prop = e.feature.properties;

      // Each marker on the map.
      var popup = '<h3>Sweetgreen</h3><div>' + prop.address;

      var listing = listings.appendChild(document.createElement('div'));
          listing.className = 'item';

      var link = listing.appendChild(document.createElement('a'));
          link.href = '#';
          link.className = 'title';

      link.innerHTML = prop.address;
      if (prop.crossStreet) {
        link.innerHTML += '<br /><small class="quiet">' + prop.crossStreet + '</small>';
        popup += '<br /><small class="quiet">' + prop.crossStreet + '</small>';
      }

      var details = listing.appendChild(document.createElement('div'));
      details.innerHTML = prop.city;
      if (prop.phone) {
        details.innerHTML += ' &middot; ' + prop.phoneFormatted;
      }

      link.onclick = function() {
        setActive(listing);

        // When a menu item is clicked, animate the map to center
        // its associated locale and open its popup.
        map.setView(e.getLatLng(), 16);
        e.openPopup();
        return false;
      };

      // // Marker interaction
      e.on('click', function(a) {
          // 1. center the map on the selected marker.
          map.panTo([a.latlng.lat,a.latlng.lng]);
          map.panTo(e.getLatLng());
          // 2. Set active the markers associated listing.
          setActive(listing);
      });

      popup += '</div>';
      e.bindPopup(popup);
    

  });

// sistemo il BBOX fittandolo all'estensione delle features
  map.fitBounds(locations.getBounds());
// aggiungo la mappa di sfondo
  map.addLayer(layer);

 

 /* filtri */ 

L.geoJson(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);


