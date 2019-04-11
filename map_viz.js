mapboxgl.accessToken = 'pk.eyJ1IjoiZ29vY2hhb3poZW5nIiwiYSI6ImNqdDczdXQzNDA2Nng0NHF4d2U4bWQya2cifQ.gMTSB1UQhBLpAG9eRdSDdg';
    
var mychart = echarts.init(document.getElementById('map'));

var INTERVAL = [1, 2, 4, 8, 12, 16, 20]; //time update step size collection
var interval = INTERVAL[4]; //time update step size
var timeout = 200; //update timeout

var curTime = document.getElementById('timeSlider').value; //current time to filter data
var curHour = parseInt(curTime/60); //current hour
var preHour = curHour; //hour of last frame

var playControl = false; //true->playing, false->pause
var curLayer = 1; //0->bus, 1->taxi, 2->subway, -1->null
var displayMode = 1; //1->flow, 0->bar


//Return data of filtered by hour
//according to the displaymode
function getData(){
    if(displayMode == 1){//flow line
        if(curLayer == 0) return bus_data[curHour];
        if(curLayer == 1) return taxi_data[curHour];
        if(curLayer == 2) return subway_data[curHour];
    }else{//bar
        if(curLayer == 0) return bus_count[curHour];
        if(curLayer == 1) return taxi_count[curHour];
        if(curLayer == 2) return subway_count[curHour];
    }
    if(curLayer == -1) return [];
}

var option = {

    mapbox:{
        style: 'mapbox://styles/goochaozheng/cjtmxzx0x51aw1fpebmqa6dgm',
        center: [113.976607, 22.600341],
        zoom: 11,
        // pitch: 60,
        // bearing: 20,
        light:{
            main:{
                shadow: true,
                intensity: 1.5,
                shadowQuality: 'medium'
            }
        }
    },
    series:[
        {
        type: 'lines3D',
        coordinateSystem: 'mapbox',
        effect: {
            show: true,
            trailWidth: 1.5,
            trailLength: 0.8,
            trailOpacity: 0.8,
            constantSpeed: interval * 4,
            trailColor: '#911010'
        },
        blendMode: 'lighter',
        polyline: true,
        lineStyle: {
            width: 0.8,
            color: '#6b0000',
            opacity: 0.5
        },
        data: getData()
    }]

}


mychart.setOption(option);

mychart.dispatchAction({
    type: 'lines3DToggleEffect',
    seriesIndex: 0
})

window.onresize = function(){
    mychart.resize();
        
    //control line effect
    if(playControl == false){
        mychart.dispatchAction({
            type: 'lines3DToggleEffect',
            seriesIndex: 0
        })
    }
}


function redraw(){

    //reset series data
    if(displayMode == 0){ //Bar

        var newOption = {
            series:[{
                type: 'bar3D',
                coordinateSystem: 'mapbox',
                shading: 'lambert',
                silent: true,
                minHeight: 10,
                animationDurationUpdate: 60/interval * timeout,
                data: getData()
            }]
        }

    }else{ //Flow

        var n_trailLength, n_lineOpacity, n_polyline;
        if(curLayer == 2){
            n_trailLength = 0.2;
            n_lineOpacity = 0.1;
            n_polyline = false;
        }else{
            n_trailLength = 0.8;
            n_lineOpacity = 0.5;
            n_polyline = true;
        }

        var newOption = {
            series:[{
                type: 'lines3D',
                coordinateSystem: 'mapbox3D',
                effect: {
                    show: true,
                    trailWidth: 1.5,
                    trailLength: n_trailLength,
                    trailOpacity: 0.8,
                    constantSpeed: interval * 4,
                    trailColor: '#911010'
                },
                blendMode: 'lighter',
                polyline: n_polyline,
                lineStyle: {
                    width: 0.8,
                    color: '#6b0000',
                    opacity: n_lineOpacity
                },
                data: getData()
            }]
        };
    }

    mychart.setOption(newOption);
    

    //control line effect
    if(playControl == false){
        mychart.dispatchAction({
            type: 'lines3DToggleEffect',
            seriesIndex: 0
        })
    }

}

function next() {
    if(playControl == true){

        //Update current time & current hour
        preHour = curHour;
        curTime = (curTime + interval) % 1440;
        curHour = parseInt(curTime/60);
        document.getElementById('timeSlider').value = curTime;

        //Update current time text
        var timeText = '';
        if(curHour < 10){
            timeText = timeText + '0' + curHour + ':';
        }else{
            timeText = timeText + curHour + ':';
        }
        if(curTime%60 < 10){
            timeText = timeText + '0' + curTime%60;
        }else{
            timeText = timeText + curTime%60;
        }
        document.getElementById('time').textContent =  timeText;

        if(curHour != preHour){
            redraw();
        }

        //Update loop
        setTimeout(next, timeout);
    }
}

document.getElementById('timeSlider').addEventListener('change', function (e) {
    curTime = parseInt(e.target.value);
    curHour = parseInt(curTime/60);

    if(curHour == preHour){
        alert(curHour);
    }

    //Update current time text
    var timeText = '';
    if(curHour < 10){
        timeText = timeText + '0' + curHour + ':';
    }else{
        timeText = timeText + curHour + ':';
    }
    if(curTime%60 < 10){
        timeText = timeText + '0' + curTime%60;
    }else{
        timeText = timeText + curTime%60;
    }
    document.getElementById('time').textContent =  timeText;

    redraw();
    // chartUpdate();
});

document.getElementById('playButton').onclick = function(){ 
    if(playControl == false){
        playControl = true;
        document.getElementById('playButton').setAttribute("disabled", true);
        mychart.dispatchAction({
            type: 'lines3DToggleEffect',
            seriesIndex: 0
        })
        setTimeout(next, timeout);
    }
};
document.getElementById('pauseButton').onclick = function(){
    if(playControl == true){
        mychart.dispatchAction({
            type: 'lines3DToggleEffect',
            seriesIndex: 0
        })
    }
    playControl = false;
    document.getElementById('playButton').removeAttribute("disabled");
};

document.getElementById('speedSlider').addEventListener('input', function (e) {
    var num = parseInt(e.target.value, 10);
    interval = INTERVAL[num];
    var newOption = {
        series:[{
            effect: {
                constantSpeed: interval * 4
            },
        }]
    };
    mychart.setOption(newOption);

    //control line effect
    if(playControl == false){
        mychart.dispatchAction({
            type: 'lines3DToggleEffect',
            seriesIndex: 0
        })
    }
});



//layers control
document.getElementById('busControlInput').addEventListener('change', function(){
    if($("#busControlInput").is(":checked")){
        curLayer = 0;
        document.getElementById('subwayControlInput').checked = false;
        document.getElementById('taxiControlInput').checked = false;
        redraw();
    }else{
        curLayer = -1;
        redraw();
    }
})

document.getElementById('subwayControlInput').addEventListener('change', function(){
    if($("#subwayControlInput").is(":checked")){
        curLayer = 2;
        document.getElementById('taxiControlInput').checked = false;
        document.getElementById('busControlInput').checked = false;
        redraw();
    }else{
        curLayer = -1;
        redraw();
    }
})

document.getElementById('taxiControlInput').addEventListener('change', function(){
    if($("#taxiControlInput").is(":checked")){
        curLayer = 1;
        document.getElementById('busControlInput').checked = false;
        document.getElementById('subwayControlInput').checked = false;
        redraw();
    }else{
        curLayer = -1;
        redraw();
    }
})
    


// //Subway popup
// // var subwayPopup = new mapboxgl.Popup({
// //     closeButton: false,
// //     closeOnClick: false
// // });

// // map.on('mouseenter', 'subway_circle', function(e) {

// //     map.getCanvas().style.cursor = 'pointer';
     
// //     var coordinates = e.features[0].geometry.coordinates.slice();
// //     var description = e.features[0].properties.station;
// //     var count = 0;
// //     for(var i=0; i<e.features.length; i++){
// //         count += e.features[i].properties.count;
// //     }
     
// //     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
// //         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
// //     }
     
// //     subwayPopup.setLngLat(coordinates)
// //     .setHTML(
// //         "<span class='subway'>" + description + ": </span>" + 
// //         "<span>" + count + "</span>"
// //     )
// //     .addTo(map);
// // });

// // map.on('mouseleave', 'subway_circle', function() {
// //     map.getCanvas().style.cursor = '';
// //     subwayPopup.remove();
// // });





