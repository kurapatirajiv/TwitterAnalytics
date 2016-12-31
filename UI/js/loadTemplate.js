
/* Basic Template which hits several functions in different Js files present in the folder directory

   these Js files represents different graphs */

/* Plot Popular Hash Tags Using Word Cloud */

/* Template Word Cloud: http://bl.ocks.org/ericcoopey/6382449 */

function loadFontCloud() {
	$(".popUpDiv").bPopup({
			 popUpDivClose: true
		});
		var fill = d3.scale.category20();
		d3.csv("hashtags.txt", function(data) {
		data.forEach(function(d) {
			d.size = +d.size;
		});

		d3.layout.cloud().size([900, 600]).words(data).padding(5).rotate(function() {
			return ~~(Math.random() * 2) * 90;
		}).font("Impact").fontSize(function(d) {
			return Math.max(8, Math.min(d.size, d.size-300,50));
		}).on("end", draw).start();

		function draw(words) {
			d3.select(".popUpDiv").html('<a class="b-close">x</a>'); 
			d3.select(".popUpDiv").append("svg").attr("width", 600).attr("height", 600).append("g").attr("transform", "translate(300,300)").selectAll("text").data(data).enter().append("text").style("font-size", function(d) {
				return d.size + "px";
			}).style("font-family", "Impact").style("fill", function(d, i) {
				return fill(i);
			}).attr("text-anchor", "middle").attr("transform", function(d) {
				return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			}).text(function(d) {
				return d.text;
			});
		}

	});
}

/* Plot Popular Leaders Using Donut Charts */

/* Template Donut: http://bl.ocks.org/mbostock/3887193 */


function loadDonut() {
	$(".popUpDiv").bPopup({
			 popUpDivClose: true
		});
	var width = 1000, height = 500, radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
    .range(["#40FF00", "#FE2EC8", "#FF0000", "#04B4AE", "#FF8000"]);

	var arc = d3.svg.arc().outerRadius(radius - 5).innerRadius(100);

	var pie = d3.layout.pie().sort(null).value(function(d) {
		return d.value;
	});
	d3.select(".popUpDiv").html('<a class="b-close">x</a>'); 
	var svg = d3.select(".popUpDiv").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	d3.csv("Leaders.txt", function(error, data) {

		data.forEach(function(d) {
			d.value = +d.value;
		});
		var g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");

		g.append("path").attr("d", arc).style("fill", function(d) {
			return color(d.data.key);
		});

		g.append("text").attr("transform", function(d) {
			return "translate(" + arc.centroid(d) + ")";
		}).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
			return d.data.key;
		});
	});
}


/* Plot Sensitivity Using Pie Charts */

/* Template Pie Chart: http://bl.ocks.org/mbostock/3887235 */

function loadPie(){
	$(".popUpDiv").bPopup({
			 popUpDivClose: true
		});
	var width = 1000, height = 500, radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
    .range(["#FF0000","#55FF33"]);

	var arc = d3.svg.arc().outerRadius(radius - 5).innerRadius(0);

	var pie = d3.layout.pie().sort(null).value(function(d) {
		return d.value;
	});
	d3.select(".popUpDiv").html('<a class="b-close">x</a>'); 
	var svg = d3.select(".popUpDiv").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	d3.csv("Sensitivity.txt", function(error, data) {

		data.forEach(function(d) {
			d.value = +d.value;
		});
		var g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");

		g.append("path").attr("d", arc).style("fill", function(d) {
			return color(d.data.key);
		});

		g.append("text").attr("transform", function(d) {
			return "translate(" + arc.centroid(d) + ")";
		}).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
			return d.data.key;
		});
	});
}


/* Plot TimeZone Using Waterfall Chart */

/* Template WaterFall: http://bl.ocks.org/rsloan/7123450 */

function loadWaterfall(){
$(".popUpDiv").bPopup({
			 popUpDivClose: true
		});

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 0.3;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], padding);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(function(d) { return dollarFormatter(d); });
d3.select(".popUpDiv").html('<a class="b-close">x</a>'); 
	var chart = d3.select(".popUpDiv").append("svg").attr("width", "100%")/* .attr("width", width + margin.left + margin.right)*/.attr("height", height + margin.top + margin.bottom)./*style("background", "#fff").*/append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("TimeZone.txt", type, function(error, data) {

  var cumulative = 0;
  for (var i = 0; i < data.length; i++) {
    data[i].start = cumulative;
    cumulative += data[i].value;
    data[i].end = cumulative;

    data[i].class = ( data[i].value >= 0 ) ? 'positive' : 'negative'
  }
  data.push({
    name: 'Total',
    end: cumulative,
    start: 0,
    class: 'total'
  });

  x.domain(data.map(function(d) { return d.name; }));
  y.domain([0, d3.max(data, function(d) { return d.end; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var bar = chart.selectAll(".bar")
      .data(data)
    .enter().append("g")
      .attr("class", function(d) { return "bar " + d.class })
      .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return y( Math.max(d.start, d.end) ); })
      .attr("height", function(d) { return Math.abs( y(d.start) - y(d.end) ); })
      .attr("width", x.rangeBand());

  bar.append("text")
      .attr("x", x.rangeBand() / 2)
      .attr("y", function(d) { return y(d.end) + 5; })
      .attr("dy", function(d) { return ((d.class=='negative') ? '-' : '') + ".75em" })
      .text(function(d) { return dollarFormatter(d.end - d.start);});

  bar.filter(function(d) { return d.class != "total" }).append("line")
      .attr("class", "connector")
      .attr("x1", x.rangeBand() + 5 )
      .attr("y1", function(d) { return y(d.end) } )
      .attr("x2", x.rangeBand() / ( 1 - padding) - 5 )
      .attr("y2", function(d) { return y(d.end) } )
});

function type(d) {
  d.value = +d.value;
  return d;
}

function dollarFormatter(n) {
  n = Math.round(n);
  var result = n;
  if (Math.abs(n) > 1000) {
    result = Math.round(n/1000) + 'K';
  }
  return result;
}
}

/* Plot TimeZone Using Line Chart */

/* Template Line Chart : http://www.highcharts.com/demo/line-basic/gray */

function loadGraph() {
	
	var w = 900;
    var h = 500;
    var left = Number((screen.width/2)-(w/2));
    var tops = Number((screen.height/2)-(h/2));
	window.open("Line.html", '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+tops+', left='+left);

}


/* Plot TimeZone Using Line Chart */

/* Template Bubble: http://bl.ocks.org/phuonghuynh/54a2f97950feadb45b07 */
	
function loadBubble() {
	
	var w = 700;
    var h = 500;
    var left = Number((screen.width/2)-(w/2));
    var tops = Number((screen.height/2)-(h/2));
	window.open("BubbleChart.html", '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+tops+', left='+left);

}	
	

