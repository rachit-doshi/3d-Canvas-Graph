

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

    ellipseLayer.add(draw_ellipse());
    stage.add(ellipseLayer);
    stage.add(layer);
    context = layer.getContext();
    context.clear();
    //positionFrames();
    drawAxis();
    animate();
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
                context.fillText(counter, graphCenter.x + (axisPlotBar / 2) + 3, graphCenter.y + (oneUnitPixel * counter * maxUnits[i].y));
            }
        } else {
            for (var counter = 1; counter <= maxPlots; counter++) {
                context.beginPath();
                context.moveTo(graphCenter.x + (oneUnitPixel * counter * maxUnits[i].x), graphCenter.y - (axisPlotBar / 2));
                context.lineTo(graphCenter.x + (oneUnitPixel * counter * maxUnits[i].x), graphCenter.y + (axisPlotBar / 2));
                context.setAttr('strokeStyle', color);
                context.setAttr('lineWidth', lineWidth);
                context.stroke();
                context.fillText(counter, graphCenter.x + (oneUnitPixel * counter * maxUnits[i].x), graphCenter.y + (axisPlotBar / 2) + 8);
            }
        }
    }

    return true;
}

function plotPointsOnAxis() {

}


function generate_ellipse_points(xWidth, yWidth, rads) {
    return {x: ellipseDistance.x + (xWidth * Math.cos(Math.PI * rads)), y: ellipseDistance.y + (yWidth * Math.sin(Math.PI * rads))};
}

function drawLine() {

}


function convertFormula() {
    var formula = 'sqrt(x)';

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

    position = generate_ellipse_points(coneWidth, coneHeight, radian);
    context.beginPath();
    context.moveTo(graphCenter.x, graphCenter.y);
    context.quadraticCurveTo(position.x, position.y, position.x, position.y);
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
    if (Math.floor(radian) === 2) {
        window.cancelAnimationFrame(id);
        radian = 0;
        return;
    }

    radian += 0.01;
    draw_quadratic_curve(radian, context);

    id = window.requestAnimationFrame(animate);
}

