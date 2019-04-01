mapboxgl.accessToken = 'pk.eyJ1IjoiZ29vY2hhb3poZW5nIiwiYSI6ImNqdDczdXQzNDA2Nng0NHF4d2U4bWQya2cifQ.gMTSB1UQhBLpAG9eRdSDdg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/goochaozheng/cjtmxzx0x51aw1fpebmqa6dgm',
    center: [114.0579, 22.5431],
    zoom: 13,
    maxZoom: 15,
    minZoom: 10,
});

map.boxZoom.disable();

var boxPopup = new mapboxgl.Popup({
    closeButton: false
});


map.on('load', function () {

    map.addSource('bus', {
        'type': 'geojson',
        'data': 'data/bus.geojson'
    });

    map.addSource('taxi', {
        'type': 'geojson',
        'data': 'data/taxi.geojson'
    });

    map.addSource('subway', {
        'type': 'geojson',
        'data': 'data/subway.geojson'
    });

    map.addSource('truck', {
        'type': 'geojson',
        'data': 'data/truck.geojson'
    });

    map.addLayer({
        'id': 'truck_circle',
        'type': 'circle',
        'source': 'truck',
        'icon-allow-overlap': true,
        'paint': {
            'circle-color': '#E6A3E6',
            'circle-opacity': 0.75,
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 1,
                13, 2.5,
                15, 5
            ],
            'circle-blur': 0
        }
    });

    map.addLayer({
        'id': 'taxi_circle',
        'type': 'circle',
        'source': 'taxi',
        'icon-allow-overlap': true,
        'paint': {
            'circle-color': '#007bff',
            'circle-opacity': 0.75,
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 1,
                13, 2.5,
                15, 5
            ],
            'circle-blur': 0
        }
    });

    map.addLayer({
        'id': 'bus_circle',
        'type': 'circle',
        'source': 'bus',
        'icon-allow-overlap': true,
        'paint': {
            'circle-color': '#ef834e',
            'circle-opacity': 0.75,
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 1,
                13, 2.5,
                15, 5
            ],
            'circle-blur': 0
        }
    });

    map.addLayer({
        'id': 'subway_circle',
        'type': 'circle',
        'source': 'subway',
        'icon-allow-overlap': true,
        'paint': {
            'circle-color': '#43B455',
            'circle-opacity': 0.4,
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'count'],
                0, 0,
                150, 30
            ],
            'circle-blur': 0
        }
    });

    //filter by time
    filterBy(curHour);

});

var canvas = map.getCanvasContainer();
var start;
var startLnglat;
var current;
var box;

map.on('mousedown', function(e){
    startLnglat = e.lngLat;
});

canvas.addEventListener('mousedown', mouseDown, true);

function mousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return new mapboxgl.Point(
    e.clientX - rect.left - canvas.clientLeft,
    e.clientY - rect.top - canvas.clientTop
    );
}

function mouseDown(e) {

    if(box){
        boxPopup.remove();
        box.parentNode.removeChild(box);
        box = null;
    }

    // Continue the rest of the function if the shiftkey is pressed.
    if (!(e.shiftKey && e.button === 0)) return;

    // Disable default drag zooming when the shift key is held down.
    map.dragPan.disable();
     
    // Call functions for the following events
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keydown', onKeyDown);
     
    // Capture the first xy coordinates
    start = mousePos(e);
}

function onMouseMove(e) {
    // Capture the ongoing xy coordinates
    current = mousePos(e);
     
    // Append the box element if it doesnt exist
    if (!box) {
        box = document.createElement('div');
        box.classList.add('boxdraw');
        canvas.appendChild(box);
    }
     
    var minX = Math.min(start.x, current.x),
    maxX = Math.max(start.x, current.x),
    minY = Math.min(start.y, current.y),
    maxY = Math.max(start.y, current.y);
     
    // Adjust width and xy position of the box element ongoing
    var pos = 'translate(' + minX + 'px,' + minY + 'px)';
    box.style.transform = pos;
    box.style.WebkitTransform = pos;
    box.style.width = maxX - minX + 'px';
    box.style.height = maxY - minY + 'px';
}

function onMouseUp(e) {
    // Capture xy coordinates
    finish([start, mousePos(e)]);
}

function onKeyDown(e) {
    // If the ESC key is pressed
    if (e.keyCode === 27) finish();
}

function finish(bbox) {
    // Remove these events now that finish has been called.
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('mouseup', onMouseUp);
     
    // If bbox exists. use this value as the argument for `queryRenderedFeatures`
    if (bbox) {
        var busCount = map.queryRenderedFeatures(bbox, { layers: ['bus_circle'] }).length;
        var taxiCount = map.queryRenderedFeatures(bbox, { layers: ['taxi_circle'] }).length;
        var truckCount = map.queryRenderedFeatures(bbox, { layers: ['truck_circle'] }).length;
        var subwayCount = 0;

        var subwayFeatures = map.queryRenderedFeatures(bbox, { layers: ['subway_circle'] });
        for(var i=0; i<subwayFeatures.length; i++){
            subwayCount += subwayFeatures[i].properties.count;
        }

        var sum = busCount + taxiCount + truckCount + subwayCount;
        var busRatio = (busCount * 100 / sum).toFixed(2);
        var taxiRatio = (taxiCount * 100/ sum).toFixed(2);
        var subwayRatio = (subwayCount * 100/ sum).toFixed(2);
        var truckRatio = (truckCount * 100/ sum).toFixed(2);
    }

    var text = 
    "<span class='bus'>Bus: " + busRatio + "%</span><span> (" + busCount + ")</span><br/>" + 
    "<span class='taxi'>Taxi: " + taxiRatio + "%</span><span> (" + taxiCount + ")</span><br/>" + 
    "<span class='subway'>Subway: " + subwayRatio + "%</span><span> (" + subwayCount + ")</span><br/>" + 
    "<span class='truck'>Truck: " + truckRatio + "%</span><span> (" + truckCount + ")</span><br/>";

    boxPopup.setLngLat(startLnglat)
    .setHTML(text)
    .addTo(map);
     
    map.dragPan.enable();
}





//Subway popup
var subwayPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

map.on('mouseenter', 'subway_circle', function(e) {

    map.getCanvas().style.cursor = 'pointer';
     
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.station;
    var count = 0;
    for(var i=0; i<e.features.length; i++){
        count += e.features[i].properties.count;
    }
     
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    subwayPopup.setLngLat(coordinates)
    .setHTML(
        "<span class='subway'>" + description + ": </span>" + 
        "<span>" + count + "</span>"
    )
    .addTo(map);
});

map.on('mouseleave', 'subway_circle', function() {
    map.getCanvas().style.cursor = '';
    subwayPopup.remove();
});




//play control
var speed = [3000, 2500, 2000, 1500, 1000, 600, 300];
var curHour = 10;
var interval = speed[4];
var playControl = false;

function filterBy(h) {
    
    var filters;

    if(h==23){
        filters = ['in', 'hour', 23, 0];
        document.getElementById('time').textContent = "23:00-0:00";
    }else{
        filters = ['in', 'hour', h, h+1];
        document.getElementById('time').textContent = String(h) + ":00-" + String(h+1) + ":00";
    }
    
    map.setFilter('bus_circle', filters);
    map.setFilter('taxi_circle', filters);
    map.setFilter('truck_circle', filters);


    filters = ['in', 'hour', h];
    map.setFilter('subway_circle', filters);

}

function setSpeed() {
    if(playControl == true){
        curHour = (curHour + 1) % 24;
        slider.value = curHour;
        filterBy(curHour);
        setTimeout(setSpeed, interval);
        chartUpdate();
    }
}

document.getElementById('slider').addEventListener('input', function (e) {
    curHour = parseInt(e.target.value)
    filterBy(curHour);
});

document.getElementById('playButton').onclick = function(){ 
    if(playControl == false){
        playControl = true;
        document.getElementById('playButton').setAttribute("disabled", true);
        setTimeout(setSpeed, interval);
    }
};
document.getElementById('pauseButton').onclick = function(){
    playControl = false;
    document.getElementById('playButton').removeAttribute("disabled");
};


document.getElementById('speed').addEventListener('input', function (e) {
    var num = parseInt(e.target.value, 10);
    interval = speed[num - 1];
});




//layers control
$('#busControlInput').change(function(){
    if($("#busControlInput").is(":checked")){
        map.setLayoutProperty('bus_circle', 'visibility', 'visible');
    }else{
        map.setLayoutProperty('bus_circle', 'visibility', 'none');
    }
})

$('#subwayControlInput').change(function(){
    if($("#subwayControlInput").is(":checked")){
        map.setLayoutProperty('subway_circle', 'visibility', 'visible');
    }else{
        map.setLayoutProperty('subway_circle', 'visibility', 'none');
    }
})

$('#taxiControlInput').change(function(){
    if($("#taxiControlInput").is(":checked")){
        map.setLayoutProperty('taxi_circle', 'visibility', 'visible');
    }else{
        map.setLayoutProperty('taxi_circle', 'visibility', 'none');
    }
})

$('#truckControlInput').change(function(){
    if($("#truckControlInput").is(":checked")){
        map.setLayoutProperty('truck_circle', 'visibility', 'visible');
    }else{
        map.setLayoutProperty('truck_circle', 'visibility', 'none');
    }
})

