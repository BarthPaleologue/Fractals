var Julia = {
    order: 2,
    seedX: -0.75,
    seedY: .1,
    xMin: -1.5,
    xMax: 1.5,
    yMin: -1.5,
    yMax: 1.5,
    iterationLimit: 10000,
    boundary: true,
    colorType: "HSL",
    saturation: 100,
    lightness: 50
}

function updateJulia(J, ctx) {
    let imageData = ctx.createImageData(500, 500);
    let pixels = imageData.data;

    let nbPixelsX = 500; //parseFloat(ctx.canvas.style.width);
    let nbPixelsY = 500; //parseFloat(ctx.canvas.style.height);

    let dX = (J.xMax - J.xMin) / nbPixelsX;
    let dY = (J.yMax - J.yMin) / nbPixelsY;

    let x = J.xMin;
    for (let i = 0; i < nbPixelsX; i++) {
        let y = J.yMin;
        for (let j = 0; j < nbPixelsY; j++) {
            let c = new Cpx(J.seedX, J.seedY);
            let z = new Cpx(x, y);
            let n = 0;
            while (n < J.iterationLimit) {
                z = Cpx.add(Cpx.pow(z, J.order), c);
                if (z.squaredModule > 16) break;
                n++;
            }
            if (n == J.iterationLimit) {
                pixels[(j * 500 + i) * 4] = 0;
                pixels[(j * 500 + i) * 4 + 1] = 0;
                pixels[(j * 500 + i) * 4 + 2] = 0;
                pixels[(j * 500 + i) * 4 + 3] = 255;
            } else {
                if (J.boundary) {
                    let color = [100, 100, 100];
                    if (J.colorType == "HSL") {
                        let hu = Math.sqrt((n + 1 - Math.log(0.5 * Math.log2(z.squaredModule))) / J.iterationLimit);
                        color = hslToRgb(hu, J.saturation / 100, J.lightness / 100);
                    } else if (J.colorType == "Greyscale") {
                        let scale = Math.sqrt((n + 1 - Math.log(0.5 * Math.log2(z.squaredModule))) / J.iterationLimit) * 255;
                        color = [scale * J.lightness / 100, scale * J.lightness / 100, scale * J.lightness / 100];
                    }
                    pixels[(j * 500 + i) * 4] = color[0];
                    pixels[(j * 500 + i) * 4 + 1] = color[1];
                    pixels[(j * 500 + i) * 4 + 2] = color[2];
                    pixels[(j * 500 + i) * 4 + 3] = 255;
                } else {
                    pixels[(j * 500 + i) * 4] = 100;
                    pixels[(j * 500 + i) * 4 + 1] = 100;
                    pixels[(j * 500 + i) * 4 + 2] = 100;
                    pixels[(j * 500 + i) * 4 + 3] = 255;
                }
            }
            y += dY;
        }
        x += dX;
    }
    ctx.putImageData(imageData, 0, 0);
    updateJuliaUI(J);
    Julia = J;
}

function initJuliaUi(ctx) {
    $("#settings").append("<label>Presets</label>");
    $("#settings").append("<div id='presets'></div>");
    for (let i = 1; i <= 7; i++) {
        $("#presets").append("<img src='presets/julia/" + i + ".png'/>");
    }
    $("#presets").css({
        width: $("#settings").width() + "px"
    });

    $("#presets img").on("click", function(e) {
        let settings = loadFile("presets/julia/" + ($(this).index() + 1) + ".fractal");
        $("#loading").fadeIn(100, e => updateJulia(settings, ctx));
        $("#loading").fadeOut();
    });

    $("#settings").append("<p>Ordre de l'ensemble :</p>");
    let orderSlider = createSlider("order", 2, 2, 10, (e, ui) => {
        Julia.order = ui.value;
        $("#orderHandle").html(ui.value);
    });

    // Paramètres de la fenètre
    $("#settings").append("<label class='windowSize' for='seedX'>seedX</label><input type='text' value='" + Julia.seedX + "'name='seedX' id='seedX'/>");
    $("#seedX").change(e => {
        Julia.seedX = parseFloat(eval($("#seedX").val()));
    });
    $("#settings").append("<label class='windowSize' for='seedY'>seedY</label><input type='text' value='" + Julia.seedY + "'name='seedY' id='seedY'/><br/>");
    $("#seedY").change(e => {
        Julia.seedY = parseFloat(eval($("#seedY").val()));
    });

    $("#settings").append("<label class='windowSize' for='xMin'>xMin</label><input type='text' value='" + Julia.xMin + "'name='xMin' id='xMin'/>");
    $("#xMin").change(e => {
        Julia.xMin = parseFloat(eval($("#xMin").val()));
    });
    $("#settings").append("<label class='windowSize' for='xMax'>xMax</label><input type='text' value='" + Julia.xMax + "'name='xMax' id='xMax'/><br/>");
    $("#xMax").change(e => {
        Julia.xMax = parseFloat(eval($("#xMax").val()));
    });
    $("#settings").append("<label class='windowSize' for='yMin'>yMin</label><input type='text' value='" + Julia.yMin + "'name='yMin' id='yMin'/>");
    $("#yMin").change(e => {
        Julia.yMin = parseFloat(eval($("#yMin").val()));
    });
    $("#settings").append("<label class='windowSize' for='yMax'>yMax</label><input type='text' value='" + Julia.yMax + "'name='yMax' id='yMax'/><br/>");
    $("#yMax").change(e => {
        Julia.yMax = parseFloat(eval($("#yMax").val()));
    });
    $("#settings").append("<label class='' for='iterationLimit'>Max Iterations</label><input type='text' value='" + Julia.iterationLimit + "'name='iterationLimit' id='iterationLimit'/><br/>");
    $("#iterationLimit").change(e => {
        Julia.iterationLimit = parseInt(eval($("#iterationLimit").val()));
    });

    // Choix du mode de coloration
    $("#settings").append("<label for='boundary'>Boundary</label><input type='checkbox' name='boundary' id='boundary' Checked>");
    $("#boundary").checkboxradio();
    $("#boundary").change(e => {
        Julia.boundary = !Julia.boundary;
        if ($("#colorType").selectmenu("option", "disabled")) $("#colorType").selectmenu("enable");
        else $("#colorType").selectmenu("disable");
    });
    $("#settings").append("<select id='colorType'><option>HSL</option><option>Greyscale</option><option>RGB</option></select>");
    $("#colorType").selectmenu({
        change: function(e, ui) {
            Julia.colorType = $("#colorType :selected").text();
        }
    });

    $("#settings").append("<p>Saturation :</p>");
    let saturSlider = createSlider("satur", Julia.saturation, 0, 1000, (e, ui) => {
        Julia.saturation = ui.value;
        $("#saturHandle").html(ui.value);
    });

    $("#settings").append("<p>Lightness :</p>");
    let lightSlider = createSlider("light", Julia.lightness, 0, 1000, (e, ui) => {
        Julia.lightness = ui.value;
        $("#lightHandle").html(ui.value);
    });

    $("#settings").append("<p class='button' id='reset'>Reset</p>");
    $("#reset").click(e => {
        let settings = loadFile("presets/julia/0.fractal");
        updateJulia(settings, ctx);
    });

    $("#settings").append("<p class='button' id='load'>Load</p><form enctype='multipart/form-data' hidden><input id='upl' type ='file' accept='text/html' name='files[]' size=30></form>");
    $("#load").click(e => $("#upl").trigger("click"));

    $("#settings").append("<p class='button' id='save'><a id='dl' download='Julia.fractal'>Save</a></p>");
    $("#save").click(function() {
        var now = JSON.stringify(Julia);
        $("#dl").attr("href", "data:text/plain;charset=UTF-8," + encodeURIComponent(now));
    });

    $("#settings").append("<p class='button' id='apply'>Apply</p>");
    $("#apply").click(e => {
        updateJulia(Julia, ctx);
    });
    updateJulia(Julia, ctx);
    $("#loading").fadeOut(100);

    /// cadre de sélection
    let fired = false;
    let xMin = Julia.xMin;
    let yMin = Julia.yMin;
    $("#renderer").on("mousedown", e => {
        e.preventDefault();
        if (!fired) {
            $("#selector").fadeIn();
            xMin = (e.clientX / $("#renderer").width()) * (Julia.xMax - Julia.xMin) + Julia.xMin;
            yMin = (e.clientY / $("#renderer").height()) * (Julia.yMax - Julia.yMin) + Julia.yMin;
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
            Julia.xMax = (e.clientX / $("#renderer").width()) * (Julia.xMax - Julia.xMin) + Julia.xMin;
            Julia.yMax = (e.clientY / $("#renderer").height()) * (Julia.yMax - Julia.yMin) + Julia.yMin;
            Julia.xMin = xMin;
            Julia.yMin = yMin;
            $("#xMax").val(Julia.xMax);
            $("#yMax").val(Julia.yMax);
            fired = false;
            updateJulia(Julia, ctx);
            $("#selector").fadeOut(100);
        }
    });

    $("#renderer").on("touchstart", e => {
        e.preventDefault();
        if (!fired) {
            let touch = e.touches[0];
            $("#selector").fadeIn();
            xMin = (touch.pageX / $("#renderer").width()) * (Julia.xMax - Julia.xMin) + Julia.xMin;
            yMin = (touch.pageY / $("#renderer").height()) * (Julia.yMax - Julia.yMin) + Julia.yMin;
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
            Julia.xMax = (touch.pageX / $("#renderer").width()) * (Julia.xMax - Julia.xMin) + Julia.xMin;
            Julia.yMax = (touch.pageY / $("#renderer").height()) * (Julia.yMax - Julia.yMin) + Julia.yMin;
            Julia.xMin = xMin;
            Julia.yMin = yMin;
            $("#xMax").val(Julia.xMax);
            $("#yMax").val(Julia.yMax);
            fired = false;
            updateJulia(Julia, ctx);
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
                    Julia = JSON.parse(RAW_DATA.toString());
                    $("#seedX").val(Julia.seedX);
                    $("#seedY").val(Julia.seedY);
                    $("#xMin").val(Julia.xMin);
                    $("#xMax").val(Julia.xMax);
                    $("#yMin").val(Julia.yMin);
                    $("#yMax").val(Julia.yMax);
                    if ($("#colorType").selectmenu("option", "disabled") && Julia.boundary) $("#boundary").trigger("click");
                    $("#iterationLimit").val(Julia.iterationLimit);

                    $("#loading").fadeOut();
                    updateJulia(Julia, ctx);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        });
    }

    document.getElementById("upl").addEventListener("change", handleFileSelect, false);
}

function updateJuliaUI(J) {
    $("#seedX").val(J.seedX);
    $("#seedY").val(J.seedY);
    $("#xMin").val(J.xMin);
    $("#xMax").val(J.xMax);
    $("#yMin").val(J.yMin);
    $("#yMax").val(J.yMax);
    if (J.boundary && !$("#boundary").is(":checked")) $("#boundary").trigger("click");
    $("#iterationLimit").val(J.iterationLimit);
}