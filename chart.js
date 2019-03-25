
var bus_count = [130, 123 ,300, 400, 500, 100, 200, 300, 400, 500, 100, 200, 130, 123 ,300, 400, 500, 100, 200, 300, 400, 500, 100, 200];

var chart = echarts.init(document.getElementById("chart"));

var option = {
    grid:{
        x: 10,
        y: 10,
        x2: 10,
        y2: 20
    },
    tooltip:{
        trigger: 'item'
    },
    xAxis:{
        data: ['Bus', 'Taxi', 'Subway', 'Pedestrain'],
        show: false
    },
    yAxis:{
        show: false
    },
    series:[{
        type: 'bar',
        data: [
            bus_count[curHour-1],
            bus_count[(curHour+2) % 24],
            bus_count[(curHour+5) % 24],
            bus_count[(curHour+3) % 24]
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
            type: 'bar',
            data: [
                bus_count[curHour-1],
                bus_count[(curHour+2) % 24],
                bus_count[(curHour+5) % 24],
                bus_count[(curHour+3) % 24]
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
    chart.setOption(option);
}
