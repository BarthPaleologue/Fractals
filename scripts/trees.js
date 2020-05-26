var Tree = {
    angle: Math.PI / 12,
    diminution: 2 / 3,
    baseLength: 150,
    color: "#FFFFFF"
}

let angular = Math.PI / 12;

function branch(len, T, ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, len);
    ctx.stroke();
    if (Math.abs(len) > T.baseLength * T.diminution ** 10) {
        ctx.translate(0, len);
        ctx.save();
        ctx.rotate(T.angle);
        branch(T.diminution * len, T, ctx);
        ctx.restore();
        ctx.save();
        ctx.rotate(-T.angle);
        branch(T.diminution * len, T, ctx);
        ctx.restore();
    }
}

function updateTree(T, ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    let width = 500;
    let height = 500;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = T.color;
    ctx.globalCompositeOperation = "hard-light";
    ctx.translate(width / 2, height);
    branch(-T.baseLength, T, ctx);
}

function initTreetUi(ctx) {
    $("#settings").append("<p>Angle :</p>");
    let angleSlider = createSlider("angle", 4, 1, 48, (e, ui) => {
        Tree.angle = ui.value * Math.PI / 48;
        $("#angleHandle").html(ui.value);
        updateTree(Tree, ctx);
    });

    $("#settings").append("<p>Diminution Factor :</p>");
    let diminutionSlider = createSlider("diminution", 7, 1, 9, (e, ui) => {
        Tree.diminution = ui.value / 10;
        $("#diminutionHandle").html(ui.value);
    });

    $("#settings").append("<p>Base Length :</p>");
    let baseLengthSlider = createSlider("baseLength", Tree.baseLength, 1, 200, (e, ui) => {
        Tree.baseLength = ui.value;
        $("#baseLengthHandle").html(ui.value);
    });

    $("#settings").append("<br/><label>Stroke color : </label><input class='jscolor {padding:20, borderWidth:3}' value='FFFFFF' name='color1' id='color1' readonly='readonly'/></div>");

    let inputColor1 = document.getElementById("color1");
    let picker1 = new jscolor(inputColor1);
    $("#color1").on("change", e => {
        Tree.color = picker1.toHEXString();
        updateTree(Tree, ctx)
    });

    $("#settings").append("<br/><p class='button' id='reset'>Reset</p>");
    $("#reset").click(e => {
        let settings = loadFile("presets/Tree/0.fractal");
        updateTree(settings, ctx);
    });

    $("#settings").append("<p class='button' id='load'>Load</p><form enctype='multipart/form-data' hidden><input id='upl' type='file' accept='text/html' name='files[]' size=30 /></form>");
    $("#load").click(e => $("#upl").trigger("click"));

    $("#settings").append("<p class='button' id='save'><a id='dl' download='Tree.fractal'>Save</a></p>");
    $("#save").click(function() {
        var now = JSON.stringify(Tree);
        $("#dl").attr("href", "data:text/plain;charset=UTF-8," + encodeURIComponent(now));
    });

    $("#settings").append("<p class='button' id='apply'>Apply</p>");
    $("#apply").on("click tap", e => {
        updateTree(Tree, ctx);
    });
    updateTree(Tree, ctx);
    $("#loading").fadeOut(100);


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
                    Tree = JSON.parse(RAW_DATA.toString());
                    if ($("#colorType").selectmenu("option", "disabled") && Tree.boundary) $("#boundary").trigger("click");
                    $("#iterationLimit").val(Tree.iterationLimit);

                    $("#loading").fadeOut();
                    updateTree(Tree, ctx);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        });
    }

    document.getElementById("upl").addEventListener("change", handleFileSelect, false);
}

function updateTreeUI(ctx) {
    updateTree(Tree, ctx);
}