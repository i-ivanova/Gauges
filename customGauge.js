// Config values for small gauge
const smallSize = {
  divWidth : 245,
  divHeight : 260,
  innerRadius : 85,
  outerRadius : 100,
  smallTickOffset : 30,
  bigTickOffset : 32,
  textCoeff : 0.85,
  size : 'small'
}

// Config values for normal gauge
const defaultSize = {
  divWidth: 350,
  divHeight: 350,
  innerRadius : 130,
  outerRadius : 145,
  smallTickOffset: 43,
  bigTickOffset: 45,
  textCoeff : 0.6,
  size : 'default'
}

// Supported color maps
const colorMaps = {
  'yellows' : {
    color1 : "rgb(255, 251, 224)",
    color2 : "rgb(255, 243, 160)",
    color3 : "rgb(255, 227, 18)"
  },

  'blues' : {
    color1 : "rgb(225, 255, 255)",
    color2 : "rgb(115, 185, 223)",
    color3 : "rgb(23, 139, 202)",
  },

  'viridis' : {
    color1 : "rgb(255, 255, 0)",
    color2 : "rgb(25, 156, 51)",
    color3 : "rgb(21, 43, 163)",
  },

  'plasma' : {
    color1 : "rgb(255, 241, 51)",
    color2 : "rgb(255, 59, 147)",
    color3 : "rgb(10, 66, 171)"
  },

  'autumn' : {
    color1 : "rgb(255, 255, 0)",
    color2 : "rgb(255, 153, 102)",
    color3 : "rgb(255, 0, 0)"
  },

  'cool' : {
    color1 : "rgb(0, 255, 255)",
    color2 : "rgb(169, 0, 191)",
    color3 : "rgb(227, 0, 0)"
  }
}

/** Function to create a gauge config given the parameters:
  * @param {int} minVal - lowest value displayed on gauge
  * @param {int} maxVal - highest value displayed on gauge
  * @param {int} currVal - current value displayed on the gauge
  */
function createConfig(minVal, maxVal, currentVal){
  var config =  {
        minVal : parseInt(minVal),
        maxVal : parseInt(maxVal),
        currentVal : parseInt(minVal),
      };
  return config;
}

/** Function to set the size of a gauge config given the size:
  * @param {dict} config - the config of the gauge
  * @param {dict} size - the gauge size as string
  */
function setGaugeSize(config, size){
  var sizeVals = defaultSize;
  if (size == 'small')  sizeVals = smallSize;
  for (var key in sizeVals){
    config[key] = sizeVals[key];
  }
}

/** Function to set the color of a gauge config given the colorMapId:
  * @param {dict} config - the config of the gauge
  * @param {string} colorMapId - one of the supported color maps in the
  *                              colorMaps variable
  */
function setGaugeColor(config, colorMapId){
    if (!(colorMapId in colorMaps)) colorMapId = 'autumn';
    config.color1 = colorMaps[colorMapId].color1;
    config.color2 = colorMaps[colorMapId].color2;
    config.color3 = colorMaps[colorMapId].color3;
}

/** Function to set the sensor unit of a gauge config
  * @param {dict} config - the config of the gauge
  * @param {string} unit - the sensor unit
  */
function setUnit(config, unit){
  config.unit = unit;
}

/** Function to create a gauge given a sensor id and config file
  * @param {int} id - the sensor id
  * @param {dict} config - the gauge config
  */
function createGauge(id, config){
  // select the div that will contain the svg that will display the gauge
  var svg = d3.select("#" + id).append("svg")
                               .style("width", config.divWidth + "px")
                               .style("height", config.divHeight + "px");

  //create 2 arcs that will be the main gauge
  var arcLeft = d3.arc()
               .innerRadius(config.innerRadius)
               .outerRadius(config.outerRadius)
               .startAngle(-135 * (Math.PI/180))
               .endAngle(0 * (Math.PI/180));

  var arcRight = d3.arc()
               .innerRadius(config.innerRadius)
               .outerRadius(config.outerRadius)
               .startAngle(0 * (Math.PI/180))
               .endAngle(135 * (Math.PI/180));

  svg.append("path")
     .attr("d", arcLeft)
     .attr("transform", "translate(" + config.divWidth/2 + ", " + config.divHeight/2 + ")")
     .style("fill", "url(#lgrad1" + id + "gauge)");

  svg.append("path")
     .attr("d", arcRight)
     .attr("transform", "translate(" + config.divWidth/2 + ", " + config.divHeight/2 + ")")
     .style("fill", "url(#lgrad2" + id + "gauge)");

  var defs =  svg.append("defs");

  // create linear gradient colors for the left arc with color1 and color2
  var lgrad1 = defs.append("linearGradient")
                   .attr("id", "lgrad1" + id + "gauge")
                   .attr("x1", "0%")
                   .attr("x2", "100%")
                   .attr("y1", "100%")
                   .attr("y2", "0%");
  // add stop colors
  lgrad1.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", config.color1)
        .attr("opacity", "1");

  lgrad1.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", config.color2)
        .attr("opacity", "1");


 // create linear gradient colors for the right arc with color2 and color3
  var lgrad2 = defs.append("linearGradient")
                   .attr("id", "lgrad2" + id + "gauge")
                   .attr("x1", "0%")
                   .attr("x2", "100%")
                   .attr("y1", "15%")
                   .attr("y2", "85%");

 // add stop colors
  lgrad2.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", config.color2)
        .attr("opacity", "1");

  lgrad2.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", config.color3)
        .attr("opacity", "1");

 // create the circular axis
  var axis = d3.arc()
               .innerRadius(config.innerRadius-2)
               .outerRadius(config.innerRadius)
               .startAngle(-135 * (Math.PI/180))
               .endAngle(135 * (Math.PI/180));

  svg.append("path")
      .attr("d", axis)
      .attr("transform", "translate(" + config.divWidth/2 + ", " + config.divHeight/2 + ")")
      .style("fill", "#000")

 // create the angle range for the small and large ticks,
 // there are 10 main divisions
 // the range values represent the angle at which the ticks will be added
  var largeTicks = d3.range(45, 316, 27);
  var smallTicks = d3.range(45, 316, 5.4);

 // create the range for the minimum and maxim value to be presented on the gauge
  var step = (config.maxVal - config.minVal) / 10;
  var vals = d3.range(config.minVal, config.maxVal + 1, step);

  var ga = svg.append("g");

 // add big ticks and the main values to be placed on the axis
  for (var i=0; i < largeTicks.length; i++){
    coord = getPosition(config.innerRadius - 25,
                        largeTicks[i] * (Math.PI/180),
                        config.divWidth/2,
                        config.divHeight/2 + 5);

    var tick_vals = ga.append("g").attr("class", "values");
    var tick_val = tick_vals.append("text")
                            .attr("x", coord[0])
                            .attr("y", coord[1])
                            .style("text-anchor", "middle")
                            .text(vals[i])
                            .style("font-size", "14.5px");

    if (config.size == "small") tick_val.style("font-size", "12px");

    var ticks = ga.append("g")
                  .attr("class", "big-ticks")
                  .attr("transform", "translate(" + config.divWidth/2 + ", " + config.divHeight/2 + ") rotate(" + (largeTicks[i] + 45) + ")");

    var offset_large = config.innerRadius - config.bigTickOffset;
    ticks.append("line")
         .attr("x1", 0 + offset_large)
         .attr("x2", 6 + offset_large)
         .attr("y1", 0 + offset_large)
         .attr("y2", 6 + offset_large)
         .style("stroke", "#000")
         .style("stroke-width", "2px");
   }

// add small ticks
 for (var i=0; i < smallTicks.length -1; i++){

    var ticks = ga.append("g").attr("class", "small-ticks")
                .attr("transform", "translate(" + config.divWidth/2 + ", " + config.divHeight/2 + ") rotate(" + (smallTicks[i] + 45) + ")");

    var offset_small = config.innerRadius - config.smallTickOffset;
    ticks.append("line")
         .attr("x1", 0 + offset_small)
         .attr("x2", 4 + offset_small)
         .attr("y1", 0 + offset_small)
         .attr("y2", 4 + offset_small)
         .style("stroke", "#111")
         .style("stroke-width", "1px");
   }

 // adding pointer
  var triangle = d3.symbol().type(d3.symbolTriangle).size("200");
  if (config.size == "small"){
      triangle.size("100");
  }
  var pointer = ga.append("g").attr("id", id + "triangle").append("path")
                  .attr("d", triangle)
                  .style("fill", "#000");

 // display current value and the unit
  var text = svg.append("g")
                .attr("id", id + "-current-val")
                .append("text")
                .attr("class", "live-value")
                .attr("x", config.divWidth/2)
                .attr("y", parseInt(config.divHeight * config.textCoeff))
                .text(config.currentVal + config.unit);

 // add warning message display
  var warning = svg.append("g")
                   .attr("id", id + "-warning")
                   .append("text")
                   .attr("class", "warning-status")
                   .attr("x", config.divWidth/2)
                   .attr("y", parseInt(config.divHeight - 30));
   if (config.size == "small"){
       warning.attr("y", parseInt(config.divHeight - 10));
       warning.style("font-size", "18px");
       text.style("font-size", "30px")
   }
}

/** Returns position on the edge of a circle
 * @param {int} r - the radius of the circle in pixels
 * @param {int} angle - the angle at which we want to take the position on
 *                      the edge
 * @param {int} cx - the center of the circle along the x axis in pixels
 * @param {int} cy - the center of the circle along the y axis in pixels
 */
function getPosition(r, angle, cx, cy){
  var sin = Math.round(Math.sin(angle) * r);
  var cos = Math.round(Math.cos(angle) * r);
  return [cx-sin, cy+cos];
}

/** Animation function for the pointer on the gauge
 * @param {int} id - the gauge id
 * @param {int} nval - the new val to be displayed
 * @param {dict} config - the gauge config
 */
function transition(id, nval, config) {
  var text = d3.select("#" + id + "-current-val text");
  var oval = text.text().slice(0, -config.unit.length);
  text.transition()
      .duration(1000)
      .tween("text", function(){
        var that = d3.select(this),
        i = d3.interpolateNumber(oval, nval);
        return function(t) { that.text(d3.format(",d")(i(t)) + config.unit)};
        });
  var pointer = d3.select("#" + id + "triangle path");
    pointer.transition()
           .duration(1000)
           .attrTween("transform", arcTween(oval, nval, config));
   var warning = d3.select("#" + id + "-warning text");

   var warningMessage = "";

   if (nval > config.maxVal) {
     warningMessage = "Above Threshold!";
   }
   else if (nval < config.minVal) {
     warningMessage = "Below Threshold!";
   }

   warning.text(warningMessage);
}

/** Helper animation function that does the real computations of each frame
 * of the animation
 * @param {int} oval - old gauge value
 * @param {itn} nval - new value to be displayed
 * @param {dict} config - the gauge config
 */
function arcTween(oval, nval, config) {
    return function(d, i, a) {
      return function(t) {
        var triangleOffset = 13;
        if (config.size == "small"){
          triangleOffset = 10;
        }

        if (nval > config.maxVal) nval = config.maxVal;
        if (nval < config.minVal) nval = config.minVal;

        var r = config.outerRadius + triangleOffset;
        // normalize so that the angle is computed correctly
        // find the coeefficients (a, b) in the linear function
        // standart_axis = a * old_axis + b
        var a = 100 / (config.maxVal - config.minVal);
        var b = - a * config.minVal;
        var ovalNorm = a * oval + b;
        var nvalNorm = a * nval + b;

        if (nvalNorm >= ovalNorm){
          var delta = (nvalNorm - ovalNorm);
          var alpha = (delta * t + ovalNorm) * 2.7 + 45;
          var coord = getPosition(r,
                                  alpha* Math.PI/180,
                                  config.divWidth/2,
                                  config.divHeight/2);
          return "translate(" + coord[0] + "," + coord[1] + ") rotate(" + alpha + ")";

        } else {
          var delta = (ovalNorm - nvalNorm);
          var alpha = (ovalNorm - delta * t) * 2.7 + 45;
          var coord = getPosition(r,
                                  alpha* Math.PI/180,
                                  config.divWidth/2,
                                  config.divHeight/2);
          return "translate(" + coord[0] + "," + coord[1] + ") rotate(" + alpha + ")";
        }
      }
    }
  }

  /** Returns position on the edge of a circle
   * @param {int} id - the sensor id that the gauge will present data for
   * @param {currVal} currVal -the current value of the sensor
   * @param {int} min - the lower threshold of the sensor
   * @param {int} max - the upper threshold of the sensor
   * @param {string} type - the type of the sensor, e.g. Temperature, Humidity
   * @param {string} size - the gauge size, e.g. small
   * @param {string} colorMap - the color map, e.g. yellows, blues
   * @param {string} unit - the sensor's unit
   */
function createLiveGauge(id, currVal, min, max, type, size, colorMap, unit){

  config = createConfig(min, max, currVal);
  setUnit(config,  " " + unit);
  setGaugeColor(config, colorMap);
  setGaugeSize(config, size);

  if (config.unit == ' null' || config.unit == ' undefined') config.unit = " ";

  createGauge(id, config);
  transition(id, currVal, config);

  return 1;
}
