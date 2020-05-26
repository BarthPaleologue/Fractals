function createSlider(id, basevalue = 0, min = 0, max = 10, slide = () => {}) {
    $("#settings").append("<div id='" + id + "Slider'><div id='" + id + "Handle' class='ui-slider-handle'></div></div>");
    let handle = $("#" + id + "Handle");
    return $("#" + id + "Slider").slider({
        create: () => handle.html(basevalue),
        range: "min",
        min: min,
        max: max,
        value: basevalue,
        slide: slide
    });
}

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return JSON.parse(result);
}

$.getScript("scripts/cpx.js");
$.getScript("scripts/mandelbrot.js");
$.getScript("scripts/julia.js");
$.getScript("scripts/newton_raphson.js");
$.getScript("scripts/trees.js");

function initCanvas() {
    let canvas = document.getElementById("renderer");
    return canvas;
}

function initContext(canvas) {
    let ctx = canvas.getContext("2d");
    return ctx;
}

function showInterface(type) {
    $("header, section, footer, #loading").fadeToggle(100);
    $("#explorer").fadeToggle(300, () => {
        if (type == "mandelbrot") initMandelbrotUi(ctx);
        else if (type == "julia") initJuliaUi(ctx);
        else if (type == "newton_raphson") initNRUi(ctx);
        else if (type == "trees") initTreetUi(ctx);
    });
}

var simulating = false;

var canvas = initCanvas();
var ctx = initContext(canvas);

$("#menu div").on("click", function() {
    showInterface($(this).attr("id"));
});