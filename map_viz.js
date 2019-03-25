mapboxgl.accessToken = 'pk.eyJ1IjoiZ29vY2hhb3poZW5nIiwiYSI6ImNqdDczdXQzNDA2Nng0NHF4d2U4bWQya2cifQ.gMTSB1UQhBLpAG9eRdSDdg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/goochaozheng/cjtmxzx0x51aw1fpebmqa6dgm',
    center: [114.0579, 22.5431],
    zoom: 13,
    maxZoom: 15,
    minZoom: 11.5,
});

map.on('load', function () {

    map.addSource('bus', {
        'type': 'geojson',
        'data': 'bus_parsed_lite.geojson'
    });

    map.addSource('taxi', {
        'type': 'geojson',
        'data': 'taxi_parsed.geojson'
    });

    map.addSource('subway', {
        'type': 'geojson',
        'data': 'subway_parsed.geojson'
    });


    map.addLayer({
        'id': 'bus_circle',
        'type': 'circle',
        'source': 'bus',
        'icon-allow-overlap': true,
        'paint': {
            'circle-color': '#ef834e',
            'circle-opacity': 0.75,
            'circle-radius': 5,
            'circle-blur': 1.5
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
            'circle-radius': 5,
            'circle-blur': 1.5
        }
    });

    map.addLayer({
        'id': 'subway_circle',
        'type': 'circle',
        'source': 'subway',
        'icon-allow-overlap': true,
        'paint': {
            'circle-color': '#43B455',
            'circle-opacity': 0.5,
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'count'],
                1, 3,
                150, 30
            ],
            'circle-blur': 0.5
        }
    });

    filterBy(curHour);

});


var speed = [3000, 2500, 2000, 1500, 1000, 600, 300];
var curHour = 10;
var interval = speed[4];
var playControl = false;

function filterBy(h) {
    
    var filters;

    if(h==24){
        filters = ['in', 'hour', 0, 23];
        document.getElementById('time').textContent = "23:00-0:00";
    }else{
        filters = ['in', 'hour', h, h-1];
        document.getElementById('time').textContent = String(h-1) + ":00-" + String(h) + ":00";
    }
    
    map.setFilter('bus_circle', filters);
    map.setFilter('subway_circle', filters);
    map.setFilter('taxi_circle', filters);
}


function setSpeed() {
    if(playControl == true){
        curHour = curHour % 24 + 1;
        slider.value = curHour;
        filterBy(curHour);
        setTimeout(setSpeed, interval);
        chartUpdate();
    }
}


//通过时间过滤
document.getElementById('slider').addEventListener('input', function (e) {
    curHour = parseInt(e.target.value)
    filterBy(curHour);
});

//播放控制
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


//设置播放速度
document.getElementById('speed').addEventListener('input', function (e) {
    var num = parseInt(e.target.value, 10);
    interval = speed[num - 1];
});



//图层显示选择
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

