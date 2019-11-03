# Gauges

This repository contains a JavaScript files that creates beautiful Gauges as shown below.


To add more colours and how to use the library simply follow the tutorial:
## 1. Technology ##
For the gauges we use D3.js library to create the svg element and the animation.

## 2. Simple Gauge Example
```html
<html>
 <head>
    <!-- Import D3 -->
    <script src="https://d3js.org/d3.v5.min.js"></script>
  
    <!-- Import custom made customGauge.js Library -->
    <script src="customGauge.js"></script>
  
    <!-- Custom CSS-->
    <link rel="stylesheet" href="gauges.css">
    ...
 </head>

 <body>
   <!-- The div container for our gauge, specify the id -->
   <div id="myDiv"></div>
   ...
 </body>

 <script></script>
</html>
```
In the script section choose the minimum and maximum values on the gauge axis and specify the current value to be displayed.

```javascript
var min = 0;
var max = 100;
var current = 50;
```
Now call the `createConfig` function to create the create the variable that will be the config for our gauge.

```javascript
var config = createConfig(min, max, current);
``` 

For now there is a selection of two sizes -- small and default. Specify the size using the `setGaugeSize` function.

```javascript
setGaugeSize(config, "default");
```
Set the unit of the gauge by calling the `setUnit`. If no unit is to be used just pass a single space string.

```javascript
var unit = " °C";
setUnit(config, unit);
```
The gauge uses linear gradient colors to make the visualization of the data more understandable. Look at the [Section 3](https://github.com/i-ivanova/Gauges/blob/master/README.md#3-linear-gradient-colors-explained) that explains linear gradient colors in more details.

Set the color map by making a call to `setGaugeColor` function. If no color is specified, the 'autumn' color map will be used.
```javascript
var colorMap = 'cool'; // look at the supported colormaps in the file
setGaugeColor(config, colorMap);
```
Finally, create the svg within the div object containing the gauge by calling `createGauge` function and play the animation that shows the current value by making a call to `transition`.

```javascript
var id = "myDiv"; // the div id containing the gauge
createGauge(id, config); // creates the svg 
transition(id, current, config); // plays the animation
```

This whole process is wrapped in a function `createLiveGauge` that does all the steps for you. However, it is beneficial to understand how the gauge is created in order to customize it further. The simple way to create the same gauge.

```javascript
// make sure the parameters are passed in the right order
createLiveGauge(id, current, min, max, type, size, colorMap, unit);
```

### Result
![Gauge](https://github.com/i-ivanova/Gauges/blob/master/Gauge.png)

## 3. Linear Gradient Colors Explained

The file [customGauge.js](https://github.com/i-ivanova/Gauges/blob/master/customGauge.js) contains the supported color schemes in the variable `colorMaps`. The function `createGauge` in the [customGauge.js](https://github.com/i-ivanova/Gauges/blob/master/customGauge.js) automatically creates to smooth the transition between colors depending on the values. This allows to for better visualisation of the data.

## 4. How to Add New Color Maps
We would highly recommend using this [website](http://angrytools.com/gradient/) to create your own linear gradient colors. You need to specify exactly __tree__ colors that suit together. 
*  The first color indicates when the sensor's values are very close to or below the lower limit (low)
*  The second color indicates the desired state of the sensor's data (desired)
*  The third color indicates when the sensor's values are very close to or above the upper limit (high)

Then add this to the `colormap` variable in the [customGauge.js](https://github.com/i-ivanova/Gauges/blob/master/customGauge.js) file as a string presenting the color. Could be in the standard "rgb(0, 0, 0)" format or the hex "#000" format. 

```javascript
  'myColorMap' : {
    'color1' : 'rgb(0, 0, 255)',    // low
    'color2' : 'rgb(20, 225, 34)',  // desired
    'color3' : 'rgb(255, 0, 0)'     // high
   }
```
