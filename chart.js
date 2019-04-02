var bus_count, taxi_count, subway_count, truck_count;
var chartType = 0;

$.ajaxSettings.async = false;
$.getJSON("data/hour_count.json", function(res){

    $.each(res.data, function(i, field){
        if(field.type == 'bus'){
            bus_count = field.count;
        }
        if(field.type == 'taxi'){
            taxi_count = field.count;
        }
        if(field.type == 'subway'){
            subway_count = field.count;
        }
        if(field.type == 'truck'){
            truck_count = field.count;
        }
    });

})

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
        data: ['Bus', 'Taxi', 'Subway', 'Truck'],
        show: false
    },
    yAxis:{
        show: false
    },
    series:[{
        type: 'bar',
        data: [
            bus_count[curHour],
            taxi_count[curHour],
            subway_count[curHour],
            truck_count[curHour]
        ],
        itemStyle:{
            normal:{
                color: function(params){
                    var colors = ['#ef834e', '#007bff', '#43B455', '#E6A3E6'];
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
                data: ['Bus', 'Taxi', 'Subway', 'Truck'],
                show: false
            },
            yAxis:{
                show: false
            },
            series:[{
                type: 'bar',
                data: [
                    bus_count[curHour],
                    taxi_count[curHour],
                    subway_count[curHour],
                    truck_count[curHour]
                ],
                itemStyle:{
                    normal:{
                        color: function(params){
                            var colors = ['#ef834e', '#007bff', '#43B455', '#E6A3E6'];
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
        h1 = curHour;
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
                data:  [bus_count[h0], bus_count[h1], bus_count[h2], bus_count[h3]],
                color: '#ef834e'
            },{
                name: 'Taxi',
                type: 'line',
                data:  [taxi_count[h0], taxi_count[h1], taxi_count[h2], taxi_count[h3]],
                color: '#007bff'
            },{
                name: 'Subway',
                type: 'line',
                data:  [subway_count[h0], subway_count[h1], subway_count[h2], subway_count[h3]],
                color: '#43B455'
            },{
                name: 'Truck',
                type: 'line',
                data:  [truck_count[h0], truck_count[h1], truck_count[h2], truck_count[h3]],
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
                    {value: bus_count[curHour], name:"Bus"},
                    {value: taxi_count[curHour], name:"Taxi"},
                    {value: subway_count[curHour], name: "Subway"},
                    {value: truck_count[curHour], name: "Truck"}
                ],
                itemStyle:{
                    normal:{
                        color: function(params){
                            var colors = ['#ef834e', '#007bff', '#43B455', '#E6A3E6'];
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