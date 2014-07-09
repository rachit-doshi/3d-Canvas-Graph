(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            },
                    timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function generate_canvas(stage, rotationAxis) {
    axis = rotationAxis;
    layer = new Kinetic.Layer();
    axislayer = new Kinetic.Layer();
    ellipseLayer = new Kinetic.Layer();
    // write out drag and drop events
    /*ellipseLayer.on('dragstart', function(e) {
     start = {x: e.evt.clientX, y: e.evt.clientY},
     positionFrames();
     });
     
     ellipseLayer.on('dragend', function(e) {
     start = {x: e.evt.clientX, y: e.evt.clientY},
     positionFrames();
     });*/
    convertFormula('sqrt(x)');
    var curvePoint = getCurveControlPoint();
    var total = (oneUnitPixel * maxPlots);
    var endPoint = {x: maxPlotValue / maxPlots, y: expression.evaluate({ x: maxPlotValue / maxPlots })}; 
    coneHeight = endPoint.y * total;
    controlPoints = {x: graphCenter.x + curvePoint.x, y: curvePoint.y};
    
    ellipseLayer.add(draw_ellipse());
    stage.add(ellipseLayer);
    stage.add(layer);
    context = layer.getContext();
    context.clear();
    //positionFrames();
    drawAxis();
    animate();
    plotRaw();
    
    // Draw Quadratic Curve For Both Ends
    context.beginPath();
    context.moveTo(graphCenter.x, graphCenter.y);
    context.quadraticCurveTo(graphCenter.x + (curvePoint.x), graphCenter.y - (total * curvePoint.y) + oneUnitPixel + coneWidth, graphCenter.x + (total * endPoint.x), graphCenter.y - (total * endPoint.y));
    context.setAttr('strokeStyle', 'red');
    context.setAttr('lineWidth', 1);
    context.stroke();

    context.beginPath();
    context.moveTo(graphCenter.x, graphCenter.y);
    context.quadraticCurveTo(graphCenter.x + (curvePoint.x), graphCenter.y + (total * curvePoint.y) - (oneUnitPixel + coneWidth), graphCenter.x + (total * endPoint.x), graphCenter.y + (total * endPoint.y));
    context.setAttr('strokeStyle', 'red');
    context.setAttr('lineWidth', 1);
    context.stroke();
}


function getCurveControlPoint() {
    return {x: (maxPlotValue / (maxPlots * 2)), y: expression.evaluate({x: (maxPlotValue / (maxPlots * 2))})};
}

function plotRaw() {
    context.beginPath();
    context.moveTo(graphCenter.x, graphCenter.y);
    
    for (var x = 0; x <= (maxPlotValue / maxPlots); x += 0.01) {
        positions = {x: x, y: expression.evaluate({x: x})};
        context.lineTo(graphCenter.x + (oneUnitPixel * positions.x * maxPlots), graphCenter.y - (maxPlots * oneUnitPixel * positions.y));
        context.setAttr('strokeStyle', 'purple');
        context.setAttr('lineWidth', 1);
        context.stroke();
    }
}

function drawAxis() {
    var color = 'black';

    for (var i = 0; i < maxUnits.length; i++) {
        context.beginPath();
        context.moveTo(graphCenter.x, graphCenter.y);
        context.lineTo(graphCenter.x + (oneUnitPixel * maxUnits[i].x * maxPlots), graphCenter.y + (maxPlots * oneUnitPixel * maxUnits[i].y));
        context.setAttr('strokeStyle', color);
        context.setAttr('lineWidth', lineWidth);
        context.stroke();

        if (maxUnits[i].x === 0) {
            for (var counter = 1; counter <= maxPlots; counter++) {
                context.beginPath();
                context.moveTo(graphCenter.x - (axisPlotBar / 2), graphCenter.y + (oneUnitPixel * counter * maxUnits[i].y));
                context.lineTo(graphCenter.x + (axisPlotBar / 2), graphCenter.y + (oneUnitPixel * counter * maxUnits[i].y));
                context.setAttr('strokeStyle', color);
                context.setAttr('lineWidth', lineWidth);
                context.stroke();
                context.fillText((counter) / 10, graphCenter.x + (axisPlotBar / 2) + 3, graphCenter.y + (oneUnitPixel * counter * maxUnits[i].y));
            }
        } else {
            for (var counter = 1; counter <= maxPlots; counter++) {
                context.beginPath();
                context.moveTo(graphCenter.x + (oneUnitPixel * counter * maxUnits[i].x), graphCenter.y - (axisPlotBar / 2));
                context.lineTo(graphCenter.x + (oneUnitPixel * counter * maxUnits[i].x), graphCenter.y + (axisPlotBar / 2));
                context.setAttr('strokeStyle', color);
                context.setAttr('lineWidth', lineWidth);
                context.stroke();
                context.fillText((counter) / 10, graphCenter.x + (oneUnitPixel * counter * maxUnits[i].x), graphCenter.y + (axisPlotBar / 2) + 8);
            }
        }
    }

    return true;
}


function generate_ellipse_points(xWidth, yWidth, rads) {
    return {x: ellipseDistance.x + (xWidth * Math.cos(Math.PI * rads)), y: ellipseDistance.y + (yWidth * Math.sin(Math.PI * rads))};
}


function convertFormula(formula) {
    expression = Parser.parse(formula);
}

function draw_ellipse() {
    return new Kinetic.Ellipse({
        x: ellipseDistance.x,
        y: ellipseDistance.y,
        radius: {
            x: coneWidth,
            y: coneHeight
        },
        fill: 'yellow',
        stroke: 'black',
        strokeWidth: 1,
        /*draggable: true,
         dragBoundFunc: function(pos) {
         var x = ellipseStart.x;
         var y = ellipseStart.y;
         var radius = 50;
         var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
         if (scale < 1)
         return {
         y: Math.round((pos.y - y) * scale + y),
         x: Math.round((pos.x - x) * scale + x)
         };
         else
         return pos;
         }*/
    });
}

function draw_quadratic_curve(radian, context) {
    var position = {};
    var color = 'rgba(0,0,0,0.4)';

    if ((radian.toFixed(2) <= 0.50)) {
        controlY = graphCenter.y + controlPoints.y + (oneUnitPixel * maxPlots * (radian - 0));
    } else if ((radian.toFixed(2) > 0.50) && (radian.toFixed(2) <= 1.00)) {
        controlY = graphCenter.y + controlPoints.y + (oneUnitPixel * maxPlots * (1 - radian));
    } else if ((radian.toFixed(2) > 1.00) && (radian.toFixed(2) <= 1.50)) {
        controlY = graphCenter.y + controlPoints.y - (oneUnitPixel * maxPlots * (radian - 1));
    } else {
        controlY = graphCenter.y + controlPoints.y - (oneUnitPixel * maxPlots * (2 - radian));
    }

    position = generate_ellipse_points(coneWidth, coneHeight, radian);
    context.beginPath();
    context.moveTo(graphCenter.x, graphCenter.y);
    context.quadraticCurveTo(controlPoints.x, controlY, position.x, position.y);
    context.setAttr('strokeStyle', color);
    context.setAttr('lineWidth', curveLineWidth);
    context.stroke();
}

function positionFrames() {
    var context = layer.getContext();
    context.clear();
    var radian = 0;

    for (var radian = 0; radian <= 2; radian += 0.01) {
        draw_quadratic_curve(radian, context);
    }
}

function animate() {
    if (radian.toFixed(2) == 2.00) {
        window.cancelAnimationFrame(id);
        radian = 0;
        return;
    }

    radian += 0.01;
    draw_quadratic_curve(radian, context);

    id = window.requestAnimationFrame(animate);
}

