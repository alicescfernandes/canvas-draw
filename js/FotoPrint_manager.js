

let app = null;
let mousedown = false;
function main() {
    let cnv = document.getElementById('canvas');
    let cnv2 = document.getElementById('canvas2');

    var ctx = cnv2.getContext('2d');
    ctx.canvas.width = window.innerWidth;

    var ctx = cnv.getContext('2d');
    ctx.canvas.width = window.innerWidth;

    drawCanvasRect(cnv);
    app = new FotoPrint();
    app.init();
    app.drawObj(cnv);

    app.drawObj(cnv2,true);

    cnv.addEventListener('mousedown',drag,false);
    cnv.addEventListener('mousemove',function(ev) {
        let mx = null;
        let my = null;

        if(ev.layerX || ev.layerX === 0) {
            mx = ev.layerX;
            my = ev.layerY;
        } else if(ev.offsetX || ev.offsetX === 0) {
            mx = ev.offsetX;
            my = ev.offsetY;
        }

        if(mousedown && app.mode == "brush") {
            app.drawBrush(mx,my);
            app.drawObj(cnv);
        }

    },false);
    cnv.addEventListener('mouseup',function() {
        mousedown = false;
    },false);

    //cnv.addEventListener('click',makeselecteditem,false);

    cnv.addEventListener('dblclick',makenewitem,false);
    cnv2.addEventListener('click',selectitem,false);

    document.getElementById("background").addEventListener("input",function(e) {
        app.background(e.target.value);
        app.drawObj(cnv);
    });

    document.getElementById("brush_size").addEventListener("input",function(e) {
        console.log(999)
        app.brush_size = e.target.value;
    });

    document.getElementById("foreground").addEventListener("input",function(e) {
        console.log(e.target)
        app.foreground(e.target.value);
    });


    document.getElementById("text").addEventListener("click",function(e) {
        console.log(e.target)
        app.foreground(e.target.value);
        var text = prompt("Texto a escrever");
        app.drawText(text);
        app.drawObj(cnv);
    });
    document.getElementById("brush").addEventListener("click",function(e) {
        app.mode = "brush";
    });



    document.getElementById("image").addEventListener("input",function(e) {
        console.dir(e.target.files);
        //var image = document.createElement('img');
        var src = window.URL.createObjectURL(e.target.files[0]);
        var img = new Image();
        img.src = src;
        img.onload = function() {
            app.drawPicture(this.width,this.height,src);
            app.drawObj(cnv);
        };
    });




}


function drawCanvasRect(cnv) {
    let ctx = cnv.getContext("2d");

    ctx.clearRect(0,0,cnv.width,cnv.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(0,0,cnv.width,cnv.height);
}

//Drag & Drop operation
//drag
function drag(ev) {

    let mx = null;
    let my = null;
    let cnv = null;

    if(ev.layerX || ev.layerX === 0) {
        mx = ev.layerX;
        my = ev.layerY;
    } else if(ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }

    if(app.mode == "brush") {
        mousedown = true;
        console.log("brush");

    } else {
        if(app.dragObj(mx,my)) {
            cnv = document.getElementById('canvas');
            cnv.style.cursor = "pointer";
            cnv.addEventListener('mousemove',move,false);
            cnv.addEventListener('mouseup',drop,false);
        }
    }


}

//Drag & Drop operation
//move
function move(ev) {
    console.log("move");
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    if(ev.layerX || ev.layerX === 0) {
        mx = ev.layerX;
        my = ev.layerY;
    } else if(ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    app.moveObj(mx,my);
    drawCanvasRect(cnv);
    app.drawObj(cnv);

}

//Drag & Drop operation
//drop
function drop() {
    let cnv = document.getElementById('canvas');

    cnv.removeEventListener('mousemove',move,false);
    cnv.removeEventListener('mouseup',drop,false);
    cnv.style.cursor = "crosshair";
}

//Insert a new Object on Canvas
//dblclick Event
function makenewitem(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    if(ev.layerX || ev.layerX === 0) {
        mx = ev.layerX;
        my = ev.layerY;
    } else if(ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    if(app.insertObj(mx,my)) {
        drawCanvasRect(cnv);
        app.drawObj(cnv);
    } else {
        makeselecteditem(ev)
    }
}

function makeselecteditem(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    if(ev.layerX || ev.layerX === 0) {
        mx = ev.layerX;
        my = ev.layerY;
    } else if(ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    if(app.insertSelectedObj(mx,my)) {
        drawCanvasRect(cnv);
        app.drawObj(cnv);
    }
}

function selectitem(ev) {
    let mx = null;
    let my = null;
    let cnv = document.getElementById('canvas');

    if(ev.layerX || ev.layerX === 0) {
        mx = ev.layerX;
        my = ev.layerY;
    } else if(ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    if(app.selectObj(mx,my)) {
        //drawCanvasRect(cnv);
        //app.drawObj(cnv);
    }
}

//Delete button
//Onclick Event
function remove() {
    let cnv = document.getElementById('canvas');

    app.removeObj();
    drawCanvasRect(cnv);
    app.drawObj(cnv);
}

//Save button
//Onclick Event
function saveasimage() {
    try {
        let link = document.createElement("a");
        link.download = "imagecanvas.png";
        let canvas = document.getElementById("canvas");
        link.href = canvas.toDataURL("image/png").replace("image/png","image/octet- stream");
        link.click();
    } catch(err) {
        alert("You need to change browsers OR upload the file to a server.");
    }
}