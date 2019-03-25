var data_count

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
        
    },
    yAxis:{
        show: false
    },
    series:[{
        type: 'bar',
        data: [334,324,625,123],
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

