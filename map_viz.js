mapboxgl.accessToken = 'pk.eyJ1IjoiZ29vY2hhb3poZW5nIiwiYSI6ImNqdDczdXQzNDA2Nng0NHF4d2U4bWQya2cifQ.gMTSB1UQhBLpAG9eRdSDdg';

$.getJSON("data/taxi_line_2.json", function(res){

    var mychart = echarts.init(document.getElementById('map'));
    //play control
    var INTERVAL = [30, 25, 20, 15, 10, 5, 1];
    var interval = INTERVAL[4];
    var timeout = 200;
    var curTime = document.getElementById('timeSlider').value;
    var curHour = parseInt(curTime/60);
    var preHour = curHour;

    var playControl = false;


    var option = {

        mapbox:{
            style: 'mapbox://styles/goochaozheng/cjtmxzx0x51aw1fpebmqa6dgm',
            center: [114.0579, 22.5431],
            zoom: 10,
            maxZoom: 10.5,
            minZoom: 9.5,
        },
        visualMap: {
            type: 'continuous',
            min: 0,
            max: 86399,
            text:['High','Low'],
            realtime: true,
            calculable : true
        },
        series:[{
            type: 'lines3D',
            coordinateSystem: 'mapbox',
            effect: {
                show: true,
                trailWidth: 0.3,
                trailLength: 0.8,
                trailOpacity: 0.5,
                constantSpeed: 10,
                color: '#ff270a'
            },
            blendMode: 'lighter',
            polyline: true,
            lineStyle: {
                width: 0,
                color: '#ff270a',
                opacity: 0
            },
            data: res.data
        }]
    
    }


    mychart.setOption(option);

    window.onresize = function(){
        mychart.resize();
    }


    function filterByTime(){
        
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

        //Update new car track
        if(curHour != preHour){
            
            preHour = curHour
            var newOption = {
                series:[{
                    effect: {
                        period: (60*timeout)/(interval*1000) 
                    },
                    data: res.data[curHour].concat(res.data[preHour])
                }]
            };
            mychart.setOption(newOption);
        }
    }

    function update() {
        if(playControl == true){

            //Update current time & current hour
            curTime = (curTime + interval) % 1440;
            curHour = parseInt(curTime/60);
            document.getElementById('timeSlider').value = curTime;
            filterByTime();

            setTimeout(update, timeout);
        }
    }

    document.getElementById('timeSlider').addEventListener('change', function (e) {
        curTime = parseInt(e.target.value);
        curHour = parseInt(curTime/60);
        filterByTime();
        // chartUpdate();
    });

    document.getElementById('playButton').onclick = function(){ 
        if(playControl == false){
            playControl = true;
            document.getElementById('playButton').setAttribute("disabled", true);
            setTimeout(update, timeout);
            mychart.dispatchAction({
                type: 'lines3DToggleEffect',
                seriesIndex: idx
            })
        }
    };
    document.getElementById('pauseButton').onclick = function(){
        if(playControl == true){
            mychart.dispatchAction({
                type: 'lines3DToggleEffect',
                seriesIndex: idx
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
                    period: (60*timeout)/(interval*1000) 
                },
            }]
        };
        mychart.setOption(newOption);
    });

})





// //layers control
// document.getElementById('busControlInput').addEventListener('change', function(){
//     if($("#busControlInput").is(":checked")){
//         map.setLayoutProperty('bus_circle', 'visibility', 'visible');
//         busVisibale = true;
//     }else{
//         map.setLayoutProperty('bus_circle', 'visibility', 'none');
//         busVisibale = false;
//     }
// })

// document.getElementById('subwayControlInput').addEventListener('change', function(){
//     if($("#subwayControlInput").is(":checked")){
//         map.setLayoutProperty('subway_circle', 'visibility', 'visible');
//         subwayVisibale = true;
//     }else{
//         map.setLayoutProperty('subway_circle', 'visibility', 'none');
//         subwayVisibale = false;
//     }
// })

// document.getElementById('taxiControlInput').addEventListener('change', function(){
//     if($("#taxiControlInput").is(":checked")){
//         map.setLayoutProperty('taxi_circle', 'visibility', 'visible');
//         taxiVisibale = true;
//     }else{
//         map.setLayoutProperty('taxi_circle', 'visibility', 'none');
//         taxiVisibale = false;
//     }
// })

// document.getElementById('truckControlInput').addEventListener('change', function(){
//     if($("#truckControlInput").is(":checked")){
//         map.setLayoutProperty('truck_circle', 'visibility', 'visible');
//         truckVisibale = true;
//     }else{
//         map.setLayoutProperty('truck_circle', 'visibility', 'none');
//         truckVisibale = false;
//     }
// })


// //drag box & box count
// var busVisibale = true;
// var taxiVisibale = true;
// var subwayVisibale = true;
// var truckVisibale = true;

// var canvas = map.getCanvasContainer();
// var start;
// var startLnglat;
// var current;
// var box = null;
// var curbbox = null;

// map.boxZoom.disable();

// var boxPopup = new mapboxgl.Popup({
//     closeButton: false
// });

// map.on('zoom', function(){
//     if(box){
//         boxPopup.remove();
//         box.parentNode.removeChild(box);
//         box = null;
//         curbbox = null;
//     }
// })

// map.on('mousedown', function(e){
//     startLnglat = e.lngLat;
// });

// canvas.addEventListener('mousedown', mouseDown, true);

// function mousePos(e) {
//     var rect = canvas.getBoundingClientRect();
//     return new mapboxgl.Point(
//         e.clientX - rect.left - canvas.clientLeft,
//         e.clientY - rect.top - canvas.clientTop
//     );
// }

// function mouseDown(e) {

//     if(box){
//         boxPopup.remove();
//         box.parentNode.removeChild(box);
//         box = null;
//         curbbox = null;
//     }

//     // Continue the rest of the function if the shiftkey is pressed.
//     if (!(e.shiftKey && e.button === 0)) return;

//     // Disable default drag zooming when the shift key is held down.
//     map.dragPan.disable();
     
//     // Call functions for the following events
//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);
//     document.addEventListener('keydown', onKeyDown);
     
//     // Capture the first xy coordinates
//     start = mousePos(e);
// }

// function onMouseMove(e) {
//     // Capture the ongoing xy coordinates
//     current = mousePos(e);
     
//     // Append the box element if it doesnt exist
//     if (!box) {
//         box = document.createElement('div');
//         box.classList.add('boxdraw');
//         canvas.appendChild(box);
//     }
     
//     var minX = Math.min(start.x, current.x),
//     maxX = Math.max(start.x, current.x),
//     minY = Math.min(start.y, current.y),
//     maxY = Math.max(start.y, current.y);
     
//     // Adjust width and xy position of the box element ongoing
//     var pos = 'translate(' + minX + 'px,' + minY + 'px)';
//     box.style.transform = pos;
//     box.style.WebkitTransform = pos;
//     box.style.width = maxX - minX + 'px';
//     box.style.height = maxY - minY + 'px';
// }

// function onMouseUp(e) {
//     // Capture xy coordinates
//     curbbox = [start, mousePos(e)]
//     boxCount();
// }

// function onKeyDown(e) {
//     // If the ESC key is pressed
//     if (e.keyCode === 27) boxCount();
// }

// function boxCount() {
//     // Remove these events now that finish has been called.
//     document.removeEventListener('mousemove', onMouseMove);
//     document.removeEventListener('keydown', onKeyDown);
//     document.removeEventListener('mouseup', onMouseUp);
     
//     // If bbox exists. use this value as the argument for `queryRenderedFeatures`
//     if (curbbox) {
//         var busCount = map.queryRenderedFeatures(curbbox, { layers: ['bus_circle'] }).length;
//         var taxiCount = map.queryRenderedFeatures(curbbox, { layers: ['taxi_circle'] }).length;
//         var truckCount = map.queryRenderedFeatures(curbbox, { layers: ['truck_circle'] }).length;
//         var subwayCount = 0;

//         var subwayFeatures = map.queryRenderedFeatures(curbbox, { layers: ['subway_circle'] });
//         for(var i=0; i<subwayFeatures.length; i++){
//             subwayCount += subwayFeatures[i].properties.count;
//         }

//         var busRatio, taxiRatio, subwayRatio, truckRatio;
//         var sum = busCount + taxiCount + truckCount + subwayCount;
//         if(sum != 0){
//             busRatio = (busCount * 100 / sum).toFixed(2);
//             taxiRatio = (taxiCount * 100/ sum).toFixed(2);
//             subwayRatio = (subwayCount * 100/ sum).toFixed(2);
//             truckRatio = (truckCount * 100/ sum).toFixed(2);
//         }else{
//             busRatio = 0;
//             taxiRatio = 0;
//             subwayRatio = 0;
//             truckRatio = 0;
//         }


//         var text = '<h6>Statistics</h6>';

//         if(busVisibale){
//             text += "<span class='bus'>Bus: </span><span>" + busRatio + "%</span><span> (" + busCount + ")</span><br/>";
//         }
//         if(taxiVisibale){
//             text += "<span class='taxi'>Taxi: </span><span>" + taxiRatio + "%</span><span> (" + taxiCount + ")</span><br/>";
//         }
//         if(subwayVisibale){
//             text += "<span class='subway'>Subway: </span><span>" + subwayRatio + "%</span><span> (" + subwayCount + ")</span><br/>";
//         }
//         if(truckVisibale){
//             text +=  "<span class='truck'>Truck: </span><span>" + truckRatio + "%</span><span> (" + truckCount + ")</span><br/>";
//         }
    
//         if(busVisibale || taxiVisibale || subwayVisibale || truckVisibale){
//             boxPopup.setLngLat(startLnglat)
//             .setHTML(text)
//             .addTo(map);
//         }
         
//         map.dragPan.enable();
//     }

// }

// map.on('render', function(){
//     if(curbbox){
//         boxCount();
//     }
// })


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





