var NR = {
    order: 2,
    seedX: 1,
    seedY: 0,
    xMin: -1.5,
    xMax: 1.5,
    yMin: -1.5,
    yMax: 1.5,
    iterationLimit: 20,
    color1: [255, 0, 0],
    color2: [0, 255, 0],
    color3: [0, 0, 255]
}

function f0(z) {
    return Cpx.add(Cpx.pow(z, 3), new Cpx(-1, 0)); // z^3 - 1
}

function f1(z) {
    return Cpx.mult(Cpx.pow(z, 2), new Cpx(3, 0)); // 3z²
}

function F(z, f0, f1, seedX = 1, seedY = 0) {
    return Cpx.substract(z, Cpx.mult(Cpx.divide(f0(z), f1(z)), new Cpx(seedX, seedY)));
}

function updateNR(NR, ctx) {
    let imageData = ctx.createImageData(500, 500);
    let pixels = imageData.data;

    let nbPixelsX = 500; //parseFloat(ctx.canvas.style.width);
    let nbPixelsY = 500; //parseFloat(ctx.canvas.style.height);

    let limit = 1e-1;

    let dX = (NR.xMax - NR.xMin) / nbPixelsX;
    let dY = (NR.yMax - NR.yMin) / nbPixelsY;

    let one = new Cpx(1, 0);
    let rj = new Cpx(-1 / 2, Math.sqrt(3) / 2);
    let aj = new Cpx(-1 / 2, -Math.sqrt(3) / 2);

    let x = NR.xMin;
    for (let i = 0; i < nbPixelsX; i++) {
        let y = NR.yMin;
        for (let j = 0; j < nbPixelsY; j++) {
            let z = new Cpx(x, y);
            let n = 0;
            while (n < NR.iterationLimit && Math.min(Cpx.squaredDistance(z, one), Cpx.squaredDistance(z, aj), Cpx.squaredDistance(z, rj)) > limit) {
                z = F(z, f0, f1, NR.seedX, NR.seedY);
                n++;
            }
            let factor = Math.sqrt((n + 1) / NR.iterationLimit);
            if (Cpx.squaredDistance(z, one) < limit) {
                pixels[(j * 500 + i) * 4] = NR.color1[0] * factor;
                pixels[(j * 500 + i) * 4 + 1] = NR.color1[1] * factor;
                pixels[(j * 500 + i) * 4 + 2] = NR.color1[2] * factor;
                pixels[(j * 500 + i) * 4 + 3] = 255;
            } else if (Cpx.squaredDistance(z, aj) < limit) {
                pixels[(j * 500 + i) * 4] = NR.color2[0] * factor;
                pixels[(j * 500 + i) * 4 + 1] = NR.color2[1] * factor;
                pixels[(j * 500 + i) * 4 + 2] = NR.color2[2] * factor;
                pixels[(j * 500 + i) * 4 + 3] = 255;
            } else if (Cpx.squaredDistance(z, rj) < limit) {
                pixels[(j * 500 + i) * 4] = NR.color3[0] * factor;
                pixels[(j * 500 + i) * 4 + 1] = NR.color3[1] * factor;
                pixels[(j * 500 + i) * 4 + 2] = NR.color3[2] * factor;
                pixels[(j * 500 + i) * 4 + 3] = 255;
            } else {
                pixels[(j * 500 + i) * 4] = 0;
                pixels[(j * 500 + i) * 4 + 1] = 0;
                pixels[(j * 500 + i) * 4 + 2] = 0;
                pixels[(j * 500 + i) * 4 + 3] = 255;
            }
            y += dY;
        }
        x += dX;
    }
    ctx.putImageData(imageData, 0, 0);
}

function initNRUi(ctx) {
    $("#settings").append("<p>Ordre de l'ensemble :</p>");
    let orderSlider = createSlider("order", 2, 2, 10, (e, ui) => {
        NR.order = ui.value;
        $("#orderHandle").html(ui.value);
    });

    // Paramètres de la fenètre
    $("#settings").append("<label class='windowSize' for='seedX'>seedX</label><input type='text' value='" + NR.seedX + "'name='seedX' id='seedX'/>");
    $("#seedX").change(e => {
        NR.seedX = parseFloat(eval($("#seedX").val()));
    });
    $("#settings").append("<label class='windowSize' for='seedY'>seedY</label><input type='text' value='" + NR.seedY + "'name='seedY' id='seedY'/><br/>");
    $("#seedY").change(e => {
        NR.seedY = parseFloat(eval($("#seedY").val()));
    });

    $("#settings").append("<label class='windowSize' for='xMin'>xMin</label><input type='text' value='" + NR.xMin + "'name='xMin' id='xMin'/>");
    $("#xMin").change(e => {
        NR.xMin = parseFloat(eval($("#xMin").val()));
    });
    $("#settings").append("<label class='windowSize' for='xMax'>xMax</label><input type='text' value='" + NR.xMax + "'name='xMax' id='xMax'/><br/>");
    $("#xMax").change(e => {
        NR.xMax = parseFloat(eval($("#xMax").val()));
    });
    $("#settings").append("<label class='windowSize' for='yMin'>yMin</label><input type='text' value='" + NR.yMin + "'name='yMin' id='yMin'/>");
    $("#yMin").change(e => {
        NR.yMin = parseFloat(eval($("#yMin").val()));
    });
    $("#settings").append("<label class='windowSize' for='yMax'>yMax</label><input type='text' value='" + NR.yMax + "'name='yMax' id='yMax'/><br/>");
    $("#yMax").change(e => {
        NR.yMax = parseFloat(eval($("#yMax").val()));
    });
    $("#settings").append("<label class='' for='iterationLimit'>Max Iterations</label><input type='text' value='" + NR.iterationLimit + "'name='iterationLimit' id='iterationLimit'/><br/>");
    $("#iterationLimit").change(e => {
        NR.iterationLimit = parseInt(eval($("#iterationLimit").val()));
    });

    $("#settings").append("<div class='container'><label>Colors : </label><input class='jscolor {padding:20, borderWidth:3}' value='ff0000' name='color1' id='color1' readonly='readonly'/><input class='jscolor' value='00ff00' name='color2' id='color2' readonly='readonly'/><input class='jscolor' value='0000ff' name='color3' id='color3' readonly='readonly'/></div>");

    let inputColor1 = document.getElementById("color1");
    let picker1 = new jscolor(inputColor1);
    $("#color1").on("change", e => NR.color1 = picker1.rgb);

    let inputColor2 = document.getElementById("color2");
    let picker2 = new jscolor(inputColor2);
    $("#color2").on("change", e => NR.color2 = picker2.rgb);

    let inputColor3 = document.getElementById("color3");
    let picker3 = new jscolor(inputColor3);
    $("#color3").on("change", e => NR.color3 = picker3.rgb);



    $("#yMax").change(e => {
        NR.yMax = parseFloat(eval($("#yMax").val()));
    });


    $("#settings").append("<p class='button' id='reset'>Reset</p>");
    $("#reset").click(e => {
        NR.seedX = 1;
        $("#seedX").val(NR.seedX);
        NR.seedY = 0;
        $("#seedY").val(NR.seedY);
        NR.xMin = -1.5;
        $("#xMin").val(NR.xMin);
        NR.xMax = 1.5;
        $("#xMax").val(NR.xMax);
        NR.yMin = -1.5;
        $("#yMin").val(NR.yMin);
        NR.yMax = 1.5;
        $("#yMax").val(NR.yMax);
        NR.order = 2;
        NR.iterationLimit = 30;
        NR.color1 = [255, 0, 0];
        NR.color2 = [0, 255, 0];
        NR.color3 = [0, 0, 255];
        updateNR(NR, ctx);
    });

    $("#settings").append("<p class='button' id='load'>Load</p><form enctype='multipart/form-data' hidden><input id='upl' type ='file' accept='text/html' name='files[]' size=30></form>");
    $("#load").click(e => $("#upl").trigger("click"));

    $("#settings").append("<p class='button' id='save'><a id='dl' download='newton_raphson.fractal'>Save</a></p>");
    $("#save").click(function() {
        var now = JSON.stringify(NR);
        $("#dl").attr("href", "data:text/plain;charset=UTF-8," + encodeURIComponent(now));
    });

    $("#settings").append("<p class='button' id='apply'>Apply</p>");
    $("#apply").click(e => {
        updateNR(NR, ctx);
    });
    updateNR(NR, ctx);
    $("#loading").fadeOut(100);

    /// cadre de sélection
    let fired = false;
    let xMin = NR.xMin;
    let yMin = NR.yMin;
    $("#renderer").on("mousedown", e => {
        e.preventDefault();
        if (!fired) {
            $("#selector").fadeIn();
            xMin = (e.clientX / $("#renderer").width()) * (NR.xMax - NR.xMin) + NR.xMin;
            yMin = (e.clientY / $("#renderer").height()) * (NR.yMax - NR.yMin) + NR.yMin;
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
            NR.xMax = (e.clientX / $("#renderer").width()) * (NR.xMax - NR.xMin) + NR.xMin;
            NR.yMax = (e.clientY / $("#renderer").height()) * (NR.yMax - NR.yMin) + NR.yMin;
            NR.xMin = xMin;
            NR.yMin = yMin;
            $("#xMax").val(NR.xMax);
            $("#yMax").val(NR.yMax);
            fired = false;
            updateNR(NR, ctx);
            $("#selector").fadeOut(100);
        }
    });

    $("#renderer").on("touchstart", e => {
        e.preventDefault();
        if (!fired) {
            let touch = e.touches[0];
            $("#selector").fadeIn();
            xMin = (touch.pageX / $("#renderer").width()) * (NR.xMax - NR.xMin) + NR.xMin;
            yMin = (touch.pageY / $("#renderer").height()) * (NR.yMax - NR.yMin) + NR.yMin;
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
            NR.xMax = (touch.pageX / $("#renderer").width()) * (NR.xMax - NR.xMin) + NR.xMin;
            NR.yMax = (touch.pageY / $("#renderer").height()) * (NR.yMax - NR.yMin) + NR.yMin;
            NR.xMin = xMin;
            NR.yMin = yMin;
            $("#xMax").val(NR.xMax);
            $("#yMax").val(NR.yMax);
            fired = false;
            updateNR(NR, ctx);
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
                    NR = JSON.parse(RAW_DATA.toString());
                    $("#seedX").val(NR.seedX);
                    $("#seedY").val(NR.seedY);
                    $("#xMin").val(NR.xMin);
                    $("#xMax").val(NR.xMax);
                    $("#yMin").val(NR.yMin);
                    $("#yMax").val(NR.yMax);
                    $("#iterationLimit").val(NR.iterationLimit);

                    $("#loading").fadeOut();
                    updateNR(NR, ctx);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        });
    }

    document.getElementById("upl").addEventListener("change", handleFileSelect, false);
}