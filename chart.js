var bus_count, taxi_count, subway_count, truck_count;

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

console.log(bus_count);

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
            bus_count[parseInt(curHour)],
            taxi_count[parseInt(curHour)],
            subway_count[parseInt(curHour)],
            truck_count[parseInt(curHour)]
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

var chartUpdate = function () {

    option = {
        series:[{
            data: [
                bus_count[curHour],
                taxi_count[curHour],
                subway_count[curHour],
                truck_count[curHour]
            ]
        }]
    };
    chart.setOption(option);
}
