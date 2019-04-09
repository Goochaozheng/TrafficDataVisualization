var curHour //= parseInt(curTime/60);
var busCount //= map.querySourceFeatures('bus', { filter: ['==', 'hour', curHour] }).length;
var taxiCount //= map.querySourceFeatures('taxi', { filter: ['==', 'hour', curHour] }).length;
var truckCount //= map.querySourceFeatures('truck', { filter: ['==', 'hour', curHour] }).length;
var chartType = 0;

//alert(busCount + ' ' + taxiCount + ' ' + truckCount);

var chart = echarts.init(document.getElementById("chart"));

var option = {
    grid:{
        x: 10,
        y: 30,
        x2: 10,
        y2: 15
    },
    tooltip:{
        trigger: 'item'
    },
    xAxis:{
        data: ['Bus', 'Taxi', 'Truck'],
        show: false
    },
    yAxis:{
        show: false
    },
    series:[{
        type: 'bar',
        data: [
            busCount,
            taxiCount,
            truckCount
        ],
        itemStyle:{
            normal:{
                color: function(params){
                    var colors = ['#ef834e', '#007bff', '#E6A3E6'];
                    return colors[params.dataIndex]
                }                
            }
        }
    }]
}

chart.setOption(option);

window.onresize = function(){
    chart.resize();
}

function chartUpdate() {
    
    curHour = parseInt(curTime/60);
    busCount = map.querySourceFeatures('bus', { filter: ['==', 'hour', curHour] }).length;
    taxiCount = map.querySourceFeatures('taxi', { filter: ['==', 'hour', curHour] }).length;
    truckCount = map.querySourceFeatures('truck', { filter: ['==', 'hour', curHour] }).length;

    //Update as bar chart
    if(chartType == 0){
        option = {
            grid:{
                x: 10,
                y: 30,
                x2: 10,
                y2: 15
            },
            tooltip:{
                trigger: 'item'
            },
            xAxis:{
                data: ['Bus', 'Taxi', 'Truck'],
                show: false
            },
            yAxis:{
                show: false
            },
            series:[{
                type: 'bar',
                data: [
                    busCount,
                    taxiCount,
                    truckCount
                ],
                itemStyle:{
                    normal:{
                        color: function(params){
                            var colors = ['#ef834e', '#007bff', '#E6A3E6'];
                            return colors[params.dataIndex]
                        }                
                    }
                }
            }]
        };
    }


    //Update as line chart
    if(chartType == 1){

        var h0, h1, h2, h3, h4;
        h0 = (curHour - 1 + 24) % 24;
        h2 = (curHour+1) % 24;
        h3 = (curHour+2) % 24;
        h4 = (curHour+3) % 24;

        option = {
            grid:{
                x: 0,
                y: 30,
                x2: 0,
                y2: 30
            },
            yAxis:{
                type: 'value',
                show: false,
                sacle: false,
                max: 10000,
                min: 0
            },
            xAxis:{
                type: 'category',
                show: false
            },            
            tooltip:{
                trigger: 'item',
                formatter: "{a}<br/>{c}"
            },
            series:[{
                name: 'Bus',
                type: 'line',
                data:  [
                    map.querySourceFeatures('bus', { filter: ['==', 'hour', h0] }).length,
                    busCount,
                    map.querySourceFeatures('bus', { filter: ['==', 'hour', h2] }).length,
                    map.querySourceFeatures('bus', { filter: ['==', 'hour', h3] }).length,
                    map.querySourceFeatures('bus', { filter: ['==', 'hour', h4] }).length
                ],
                color: '#ef834e'
            },{
                name: 'Taxi',
                type: 'line',
                data:  [
                    map.querySourceFeatures('taxi', { filter: ['==', 'hour', h0] }).length,
                    taxiCount,
                    map.querySourceFeatures('taxi', { filter: ['==', 'hour', h2] }).length,
                    map.querySourceFeatures('taxi', { filter: ['==', 'hour', h3] }).length,
                    map.querySourceFeatures('taxi', { filter: ['==', 'hour', h4] }).length
                ],
                color: '#007bff'
            },{
                name: 'Truck',
                type: 'line',
                data:  [
                    map.querySourceFeatures('truck', { filter: ['==', 'hour', h0] }).length,
                    truckCount,
                    map.querySourceFeatures('truck', { filter: ['==', 'hour', h2] }).length,
                    map.querySourceFeatures('truck', { filter: ['==', 'hour', h3] }).length,
                    map.querySourceFeatures('truck', { filter: ['==', 'hour', h4] }).length
                ],
                color: '#E6A3E6'
            }]

        };
    }


    //Update as pie chart
    if(chartType == 2){
        option = {
            grid:{
                x: 10,
                y: 30,
                x2: 10,
                y2: 15
            },
            tooltip:{
                trigger: 'item'
            },
            series:[{
                type: 'pie',
                data: [
                    {value: busCount, name:"Bus"},
                    {value: taxiCount, name:"Taxi"},
                    {value: truckCount, name: "Truck"}
                ],
                itemStyle:{
                    normal:{
                        color: function(params){
                            var colors = ['#ef834e', '#007bff', '#E6A3E6'];
                            return colors[params.dataIndex]
                        },
                        labelLine:{
                            show:false
                        },
                        label:{
                            show:false
                        }                
                    }
                }
            }]
        };
    }

    chart.setOption(option, true);
}


document.getElementById('barBtn').onclick = function(){ 
    chartType = 0;
    document.getElementById('barBtn').setAttribute("disabled", true);
    document.getElementById('lineBtn').removeAttribute("disabled");
    document.getElementById('pieBtn').removeAttribute("disabled");
    chartUpdate();
};

document.getElementById('lineBtn').onclick = function(){ 
    chartType = 1;
    document.getElementById('lineBtn').setAttribute("disabled", true);
    document.getElementById('barBtn').removeAttribute("disabled");
    document.getElementById('pieBtn').removeAttribute("disabled");
    chartUpdate();
};

document.getElementById('pieBtn').onclick = function(){ 
    chartType = 2;
    document.getElementById('pieBtn').setAttribute("disabled", true);
    document.getElementById('barBtn').removeAttribute("disabled");
    document.getElementById('lineBtn').removeAttribute("disabled");
    chartUpdate();
};