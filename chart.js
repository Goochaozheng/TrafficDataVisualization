var overallChart = echarts.init(document.getElementById("chart"));
var chartType = 0;

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
        data: ['Bus', 'Taxi', 'Subway'],
        show: false
    },
    yAxis:{
        show: false
    },
    series:[{
        type: 'bar',
        data: [
            {
                value: overall_count[curHour][0], 
                name:"Bus", 
                itemStyle:{
                    color: '#7a7a7a'
                }
            },{
                value: overall_count[curHour][1], 
                name:"Taxi",
                itemStyle:{
                    color: '#b63333'
                }
            },{
                value: overall_count[curHour][2], 
                name: "Subway",
                itemStyle:{
                    color: '#a1a1a1'
                }
            },
        ]
    }]
}

overallChart.setOption(option);

window.onresize = function(){
    overallChart.resize();
    mychart.resize();
        
    //control line effect
    if(playControl == false){
        mychart.dispatchAction({
            type: 'lines3DToggleEffect',
            seriesIndex: 0
        })
    }
}

function chartUpdate() {
    
    var b_color, t_color, s_color;
    if(curLayer == 0){
        b_color = '#b63333';
        t_color = '#7a7a7a';
        s_color = '#a1a1a1';
    }
    if(curLayer == 1){
        t_color = '#b63333';
        b_color = '#7a7a7a';
        s_color = '#a1a1a1';
    }
    if(curLayer == 2){
        s_color = '#b63333';
        t_color = '#7a7a7a';
        b_color = '#a1a1a1';
    }
    if(curLayer == -1){
        s_color = '#8b8b8b';
        t_color = '#7a7a7a';
        b_color = '#a1a1a1';
    }

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
                data: ['Bus', 'Taxi', 'Subway'],
                show: false
            },
            yAxis:{
                show: false
            },
            series:[{
                type: 'bar',
                data: [
                    {
                        value: overall_count[curHour][0], 
                        name:"Bus", 
                        itemStyle:{
                            color: b_color
                        }
                    },{
                        value: overall_count[curHour][1], 
                        name:"Taxi",
                        itemStyle:{
                            color: t_color
                        }
                    },{
                        value: overall_count[curHour][2], 
                        name: "Subway",
                        itemStyle:{
                            color: s_color
                        }
                    },
                ],
            }]
        };
    }


    //Update as line chart
    if(chartType == 1){

        var h0, h1, h2, h3;
        h0 = (curHour - 1 + 24) % 24;
        h1 = curHour;
        h2 = (curHour+1) % 24;


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
                data:  [overall_count[h0][0], overall_count[h1][0], overall_count[h2][0]],
                color: b_color
            },{
                name: 'Taxi',
                type: 'line',
                data:  [overall_count[h0][1], overall_count[h1][1], overall_count[h2][1]],
                color: t_color
            },{
                name: 'Subway',
                type: 'line',
                data:  [overall_count[h0][2], overall_count[h1][2], overall_count[h2][2]],
                color: s_color
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
                    {
                        value: overall_count[curHour][0], 
                        name:"Bus", 
                        itemStyle:{
                            color: b_color
                        }
                    },{
                        value: overall_count[curHour][1], 
                        name:"Taxi",
                        itemStyle:{
                            color: t_color
                        }
                    },{
                        value: overall_count[curHour][2], 
                        name: "Subway",
                        itemStyle:{
                            color: s_color
                        }
                    },
                ],
                label:{
                    show:false
                }
            }]
        };
    }

    overallChart.setOption(option, true);
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