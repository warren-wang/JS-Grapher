    //Warren Wang
    var finalEq;
	//handles the text box enter key
    function handle(e) {
        if (e.keyCode === 13) {
            clearAll();
            eqParse();
        }
        return false;
    }
	//clears the canvas and resets the message field
    function clearAll() {
        document.getElementById("message").innerHTML = "";
        var canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    //Parses the equation for evaluation
    function eqParse() {
        var eq = document.getElementById("equation").value.replace(/ /g, '');
        var arr = eq.split("");
        var newEq = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == "^") {

                if (arr[i - 1] == ")") {
                    var start = newEq.indexOf("(", 0);
                    var end = newEq.indexOf(")", 0);
                    var parenPowers = newEq.slice(start, end + 1).join("");
                    for (var z = start; z <= end; z++) {
                        delete newEq[z];
                    }
                    newEq.push("Math.pow(" + parenPowers + "," + arr[i + 1] + ")");
                    arr.splice(i + 1, 1);
                } else {
                    newEq.splice(i - 1, 1);
                    newEq.push("Math.pow(" + arr[i - 1] + "," + arr[i + 1] + ")");
                    arr.splice(i + 1, 1);
                }
            } else if (/^[a-zA-Z]*$/.test(arr[i])) {
                if (/^\d+$/.test(arr[i - 1])) {
                    newEq.push("*");
                    newEq.push(arr[i]);
                } else if (/^\d+$/.test(arr[i + 1])) {
                    newEq.push(arr[i]);
                    newEq.push("*");
                } else if (arr[i] != "x") {
                    clearAll();
                    return document.getElementById("message").innerHTML = "Please use x as your variable name.";
                } else if (/^[\w()-]{1,50}$/.test(arr[i - 1]) || /^[\w() -]{1,50}$/.test(arr[i + 1])) newEq.push(arr[i]);
            } else if (/^[\w() -]{1,50}$/.test(arr[i - 1])) newEq.push(arr[i]);
            else newEq.push(arr[i]);
        }
        finalEq = newEq.join("");
        draw();
    }
	//Sets up the canvas 
    function draw() {
        var canvas = document.getElementById("canvas");
        if (null == canvas || !canvas.getContext) return;
        var axes = {}, ctx = canvas.getContext("2d");
        axes.x0 = .5 + .5 * canvas.width; 
        axes.y0 = .5 + .5 * canvas.height; 
        axes.scale = 40; 
        axes.doNegativeX = true;
        showAxes(ctx, axes);
        funGraph(ctx, axes, fun1, "rgb(11,153,11)", 5); 
    }
	//Draws the X and Y axes
    function showAxes(ctx, axes) {
        var x0 = axes.x0, w = ctx.canvas.width;
        var y0 = axes.y0, h = ctx.canvas.height;
        var xmin = axes.doNegativeX ? 0 : x0;
        ctx.beginPath();
        ctx.strokeStyle = "rgb(128,128,128)";
        ctx.moveTo(xmin, y0);
        ctx.lineTo(w, y0); 
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, h); 
        ctx.stroke();
    }
    //Draws the equation
    function funGraph(ctx, axes, func, color, thick) {
        var xx, yy, dx = 4, x0 = axes.x0, y0 = axes.y0, scale = axes.scale;
        var iMax = Math.round((ctx.canvas.width - x0) / dx);
        var iMin = axes.doNegativeX ? Math.round(-x0 / dx) : 0;
        ctx.beginPath();
        for (var i = iMin; i <= iMax; i++) {
            xx = dx * i;
            yy = scale * func(xx / scale);
            if (i == iMin) ctx.moveTo(x0 + xx, y0 - yy);
            else ctx.fillRect(x0 + xx, y0 - yy, 2, 2);
        }
        ctx.stroke();
    }
	//Evaluates the equation that was parsed in the eqParse function 
    function fun1(x) {
        return eval(finalEq);
    }