var Mandelbrot = {
    order: 2,
    xMin: -2.5,
    xMax: 1.5,
    yMin: -2,
    yMax: 2,
    iterationLimit: 1000,
    boundary: true,
    setColor: [0, 0, 0],
    bgColor: [100, 100, 100],
    colorType: "HSL",
    saturation: 100,
    lightness: 50
}

function updateMandelbrot(M, ctx) {
    let imageData = ctx.createImageData(500, 500);
    let pixels = imageData.data;

    let nbPixelsX = 500; //parseFloat(ctx.canvas.style.width);
    let nbPixelsY = 500; //parseFloat(ctx.canvas.style.height);

    let dX = (M.xMax - M.xMin) / nbPixelsX;
    let dY = (M.yMax - M.yMin) / nbPixelsY;

    let x = M.xMin;
    for (let i = 0; i < nbPixelsX; i++) {
        let y = M.yMin;
        for (let j = 0; j < nbPixelsY; j++) {
            let c = new Cpx(x, y);
            let z = new Cpx(0, 0);
            let n = 0;
            while (n < M.iterationLimit) {
                z = Cpx.add(Cpx.pow(z, M.order), c);
                if (z.squaredModule > 16) break;
                n++;
            }
            if (n == M.iterationLimit) {
                pixels[(j * 500 + i) * 4] = M.setColor[0];
                pixels[(j * 500 + i) * 4 + 1] = M.setColor[1];
                pixels[(j * 500 + i) * 4 + 2] = M.setColor[2];
                pixels[(j * 500 + i) * 4 + 3] = 255;
            } else {
                if (M.boundary) {
                    let color = [100, 100, 100];
                    if (M.colorType == "HSL") {
                        let hu = Math.sqrt((n + 1 - Math.log(0.5 * Math.log2(z.squaredModule))) / M.iterationLimit);
                        color = hslToRgb(hu * 5, M.saturation / 100, M.lightness / 100);
                    } else if (M.colorType == "HSL2") {
                        let light = Math.sqrt((n + 1 - Math.log(0.5 * Math.log2(z.squaredModule))) / M.iterationLimit);
                        color = hslToRgb(0.2, M.saturation / 100, light);
                    } else if (M.colorType == "Greyscale") {
                        let scale = Math.sqrt((n + 1 - Math.log(0.5 * Math.log2(z.squaredModule))) / M.iterationLimit) * 255;
                        color = [scale * M.lightness / 100, scale * M.lightness / 100, scale * M.lightness / 100];
                    }
                    pixels[(j * 500 + i) * 4] = color[0];
                    pixels[(j * 500 + i) * 4 + 1] = color[1];
                    pixels[(j * 500 + i) * 4 + 2] = color[2];
                    pixels[(j * 500 + i) * 4 + 3] = 255;
                } else {
                    pixels[(j * 500 + i) * 4] = M.bgColor[0];
                    pixels[(j * 500 + i) * 4 + 1] = M.bgColor[1];
                    pixels[(j * 500 + i) * 4 + 2] = M.bgColor[2];
                    pixels[(j * 500 + i) * 4 + 3] = 255;
                }
            }
            y += dY;
        }
        x += dX;
    }
    ctx.putImageData(imageData, 0, 0);
    updateMandelbrotUI(M);
    Mandelbrot = M;
}

function initMandelbrotUi(ctx) {
    // Presets
    $("#settings").append("<label>Presets</label>");
    $("#settings").append("<div id='presets'></div>");
    for (let i = 1; i <= 14; i++) {
        $("#presets").append("<img src='presets/mandelbrot/" + i + ".png'/>");
    }
    $("#presets").css({ width: $("#settings").width() + "px" });

    $("#presets img").on("click", function(e) {
        let settings = loadFile("presets/mandelbrot/" + ($(this).index() + 1) + ".fractal");
        $("#loading").fadeIn(100, e => updateMandelbrot(settings, ctx));
        $("#loading").fadeOut();
    });

    $("#settings").append("<p>Ordre de l'ensemble :</p>");
    let orderSlider = createSlider("order", 2, 2, 10, (e, ui) => {
        Mandelbrot.order = ui.value;
        $("#orderHandle").html(ui.value);
    });

    // Paramètres de la fenètre
    $("#settings").append("<label class='windowSize' for='xMin'>xMin</label><input type='text' value='" + Mandelbrot.xMin + "'name='xMin' id='xMin'/>");
    $("#xMin").change(e => {
        Mandelbrot.xMin = parseFloat(eval($("#xMin").val()));
    });
    $("#settings").append("<label class='windowSize' for='xMax'>xMax</label><input type='text' value='" + Mandelbrot.xMax + "'name='xMax' id='xMax'/><br/>");
    $("#xMax").change(e => {
        Mandelbrot.xMax = parseFloat(eval($("#xMax").val()));
    });
    $("#settings").append("<label class='windowSize' for='yMin'>yMin</label><input type='text' value='" + Mandelbrot.yMin + "'name='yMin' id='yMin'/>");
    $("#yMin").change(e => {
        Mandelbrot.yMin = parseFloat(eval($("#yMin").val()));
    });
    $("#settings").append("<label class='windowSize' for='yMax'>yMax</label><input type='text' value='" + Mandelbrot.yMax + "'name='yMax' id='yMax'/><br/>");
    $("#yMax").change(e => {
        Mandelbrot.yMax = parseFloat(eval($("#yMax").val()));
    });
    $("#settings").append("<label class='' for='iterationLimit'>Max Iterations</label><input type='text' value='" + Mandelbrot.iterationLimit + "'name='iterationLimit' id='iterationLimit'/><br/>");
    $("#iterationLimit").change(e => {
        Mandelbrot.iterationLimit = parseInt(eval($("#iterationLimit").val()));
    });

    // Choix du mode de coloration
    $("#settings").append("<label for='boundary'>Boundary</label><input type='checkbox' name='boundary' id='boundary' Checked>");
    $("#boundary").checkboxradio();
    $("#boundary").change(e => {
        Mandelbrot.boundary = !Mandelbrot.boundary;
        if ($("#colorType").selectmenu("option", "disabled")) $("#colorType").selectmenu("enable");
        else $("#colorType").selectmenu("disable");
    });
    $("#settings").append("<select id='colorType'><option>HSL</option><option>Greyscale</option><option>RGB</option></select>");
    $("#colorType").selectmenu({
        change: function(e, ui) {
            Mandelbrot.colorType = $("#colorType :selected").text();
        }
    });

    $("#settings").append("<br/><label>Set's&nbsp;color : </label><input class='jscolor {padding:20, borderWidth:3}' value='000000' name='color1' id='color1' readonly='readonly'/></div>");

    let inputColor1 = document.getElementById("color1");
    let picker1 = new jscolor(inputColor1);
    $("#color1").on("change", e => Mandelbrot.setColor = picker1.rgb);

    $("#settings").append("<label>Background&nbsp;color : </label><input class='jscolor {padding:20, borderWidth:3}' value='333333' name='color2' id='color2' readonly='readonly'/></div>");

    let inputColor2 = document.getElementById("color2");
    let picker2 = new jscolor(inputColor2);
    $("#color2").on("change", e => Mandelbrot.bgColor = picker2.rgb);

    $("#settings").append("<p>Saturation :</p>");
    let saturSlider = createSlider("satur", Mandelbrot.saturation, 0, 1000, (e, ui) => {
        Mandelbrot.saturation = ui.value;
        $("#saturHandle").html(ui.value);
    });

    $("#settings").append("<p>Lightness :</p>");
    let lightSlider = createSlider("light", Mandelbrot.lightness, 0, 1000, (e, ui) => {
        Mandelbrot.lightness = ui.value;
        $("#lightHandle").html(ui.value);
    });

    $("#settings").append("<p class='button' id='reset'>Reset</p>");
    $("#reset").click(e => {
        let settings = loadFile("presets/mandelbrot/0.fractal");
        updateMandelbrot(settings, ctx);
    });

    $("#settings").append("<p class='button' id='load'>Load</p><form enctype='multipart/form-data' hidden><input id='upl' type ='file' accept='text/html' name='files[]' size=30></form>");
    $("#load").click(e => $("#upl").trigger("click"));

    $("#settings").append("<p class='button' id='save'><a id='dl' download='mandelbrot.fractal'>Save</a></p>");
    $("#save").click(function() {
        var now = JSON.stringify(Mandelbrot);
        $("#dl").attr("href", "data:text/plain;charset=UTF-8," + encodeURIComponent(now));
    });

    $("#settings").append("<p class='button' id='apply'>Apply</p>");
    $("#apply").on("click tap", e => {
        updateMandelbrot(Mandelbrot, ctx);
    });
    updateMandelbrot(Mandelbrot, ctx);
    $("#loading").fadeOut(100);

    /// cadre de sélection
    let fired = false;
    let xMin = Mandelbrot.xMin;
    let yMin = Mandelbrot.yMin;
    $("#renderer").on("mousedown", e => {
        e.preventDefault();
        if (!fired) {
            $("#selector").fadeIn();
            xMin = (e.clientX / $("#renderer").width()) * (Mandelbrot.xMax - Mandelbrot.xMin) + Mandelbrot.xMin;
            yMin = (e.clientY / $("#renderer").height()) * (Mandelbrot.yMax - Mandelbrot.yMin) + Mandelbrot.yMin;
            $("#selector").css({
                top: e.clientY,
                left: e.clientX,
                bottom: window.innerHeight - e.clientY,
                right: $("body").width() - e.clientX,
            });
            $("#xMin").val(xMin);
            $("#yMin").val(yMin);
            fired = true;
        }
    });

    $("#renderer, #selector").on("mousemove", e => {
        e.preventDefault();
        if (fired) {
            $("#selector").css({
                bottom: window.innerHeight - e.clientY,
                right: $("body").width() - e.clientX,
            });
        }
    });


    $("#renderer").on("mouseup", e => {
        e.preventDefault();
        if (fired) {
            Mandelbrot.xMax = (e.clientX / $("#renderer").width()) * (Mandelbrot.xMax - Mandelbrot.xMin) + Mandelbrot.xMin;
            Mandelbrot.yMax = (e.clientY / $("#renderer").height()) * (Mandelbrot.yMax - Mandelbrot.yMin) + Mandelbrot.yMin;
            Mandelbrot.xMin = xMin;
            Mandelbrot.yMin = yMin;
            $("#xMax").val(Mandelbrot.xMax);
            $("#yMax").val(Mandelbrot.yMax);
            fired = false;
            updateMandelbrot(Mandelbrot, ctx);
            $("#selector").fadeOut(100);
        }
    });

    $("#renderer").on("touchstart", e => {
        e.preventDefault();
        if (!fired) {
            let touch = e.touches[0];
            $("#selector").fadeIn();
            xMin = (touch.pageX / $("#renderer").width()) * (Mandelbrot.xMax - Mandelbrot.xMin) + Mandelbrot.xMin;
            yMin = (touch.pageY / $("#renderer").height()) * (Mandelbrot.yMax - Mandelbrot.yMin) + Mandelbrot.yMin;
            $("#selector").css({
                top: touch.pageY,
                left: touch.pageX,
                bottom: window.innerHeight - touch.pageY,
                right: $("body").width() - touch.pageX,
            });
            $("#xMin").val(xMin);
            $("#yMin").val(yMin);
            fired = true;
        }
    });

    let lastMove;
    $("#renderer, #selector").on("touchmove", e => {
        e.preventDefault();
        if (fired) {
            let touch = e.touches[0];
            $("#selector").css({
                bottom: window.innerHeight - touch.pageY,
                right: $("body").width() - touch.pageX,
            });
            lastMove = e;
        }
    });

    $("#renderer").on("touchend", e => {
        e.preventDefault();
        if (fired) {
            let touch = lastMove.touches[0];
            Mandelbrot.xMax = (touch.pageX / $("#renderer").width()) * (Mandelbrot.xMax - Mandelbrot.xMin) + Mandelbrot.xMin;
            Mandelbrot.yMax = (touch.pageY / $("#renderer").height()) * (Mandelbrot.yMax - Mandelbrot.yMin) + Mandelbrot.yMin;
            Mandelbrot.xMin = xMin;
            Mandelbrot.yMin = yMin;
            $("#xMax").val(Mandelbrot.xMax);
            $("#yMax").val(Mandelbrot.yMax);
            fired = false;
            updateMandelbrot(Mandelbrot, ctx);
            $("#selector").fadeOut(100);
        }
    });


    function handleFileSelect(evt) {
        $("#loading").fadeIn(100, e => {
            var files = evt.target.files; // FileList object
            // use the 1st file from the list
            f = files[0];

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return e => {
                    let RAW_DATA = e.target.result;
                    Mandelbrot = JSON.parse(RAW_DATA.toString());
                    $("#xMin").val(Mandelbrot.xMin);
                    $("#xMax").val(Mandelbrot.xMax);
                    $("#yMin").val(Mandelbrot.yMin);
                    $("#yMax").val(Mandelbrot.yMax);
                    if ($("#colorType").selectmenu("option", "disabled") && Mandelbrot.boundary) $("#boundary").trigger("click");
                    $("#iterationLimit").val(Mandelbrot.iterationLimit);

                    $("#loading").fadeOut();
                    updateMandelbrot(Mandelbrot, ctx);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        });
    }

    document.getElementById("upl").addEventListener("change", handleFileSelect, false);
}

function updateMandelbrotUI(M) {
    $("#xMin").val(M.xMin);
    $("#xMax").val(M.xMax);
    $("#yMin").val(M.yMin);
    $("#yMax").val(M.yMax);
    if (M.boundary && !$("#boundary").is(":checked")) $("#boundary").trigger("click");
    $("#iterationLimit").val(M.iterationLimit);
    $("#color1").val(M.setColor);
    $("#color1").css({
        "background-color": "rgb(" + M.setColor[0] + "," + M.setColor[1] + "," + M.setColor[2] + ")"
    });
    $("#color2").val(M.bgColor);
    $("#color2").css({
        "background-color": "rgb(" + M.bgColor[0] + "," + M.bgColor[1] + "," + M.bgColor[2] + ")"
    });
}