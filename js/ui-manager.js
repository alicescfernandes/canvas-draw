let app  = new FotoPrint();
let mousedown = false;

class UI_manager{
    constructor(){
        let self = this;
        this.state = "shape";
        this.cnv = document.getElementById('main'); 
        this.cnv2 = document.getElementById('shape-area');
        this.update();
        this.attachToDom();
        
        var ctx = this.cnv2.getContext('2d');

        var ctx = this.cnv.getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;


        window.onresize = function(){
            var ctx = self.cnv.getContext('2d');

            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;

            drawCanvasRect(self.cnv);
            app.drawObj(self.cnv);

    
        }

        app.init();
        app.drawObj(this.cnv2,true);
        app.background(document.getElementById("background-color").value);
        
        drawCanvasRect(this.cnv);
        app.drawObj(this.cnv);
        document.querySelector(".color-show.background").style.backgroundColor = document.getElementById("background-color").value;
        app.background(document.getElementById("background-color").value);
        app.foreground(document.getElementById("foreground-color").value);

    }


    update(){
        var nodes = Array.prototype.slice.call(document.querySelectorAll(".menu-content"));
        nodes.forEach(element => {
            element.style.display="none";
        });

        var node = document.querySelector(`.menu-content[data-options="${this.state}"]`);
        node.style.display = "block";

        var nodes = Array.prototype.slice.call(document.querySelectorAll("li.item-selected"));
        nodes.forEach(element => {
            element.classList.remove("item-selected");
        });

        var node = document.querySelector(`li[data-options="${this.state}"]`);
        node.classList.add("item-selected");
    }

    setState(state){
        if(state){
            this.state = state;
            this.update();
            app.setMode(state);
        }
    }

    attachToDom(){
        let self = this;
        let nodes = Array.prototype.slice.call(document.querySelectorAll(`.tool-item[data-options]`));

        nodes.forEach(element => {
            element.classList.remove("item-selected");
            element.addEventListener("click",function(e) {
                self.setState(e.currentTarget.dataset.options);
            })
        });

        document.querySelector(".export-action").addEventListener("click", function(){
            saveasimage(self.cnv);
        });


        document.querySelector(".undo-action").addEventListener("click",function() {
            app.removeObj();
            drawCanvasRect(self.cnv);
            app.drawObj(self.cnv);
        });


        document.getElementById("brush_size").addEventListener("input",function(e) {
            app.brush_size = e.target.value;
        });

        document.querySelector("#brush_size input").addEventListener("input",function(e) {
            document.querySelector("#brush_size .range-slider__value").textContent = e.currentTarget.value + "px"
        });

        document.querySelector("#brush_size input").addEventListener("input",function(e) {
            document.querySelector("#brush_size .range-slider__value").textContent = e.currentTarget.value + "px"
        });

        document.getElementById("choose_file").addEventListener("click",function(e) {
            document.getElementById("filepicker").click();
        });

        document.getElementById("filepicker").addEventListener("input",function(e) {
            var src = window.URL.createObjectURL(e.target.files[0]);
            var img = new Image();
            img.src = src;
            img.onload = function() {
                app.drawPicture(this.width,this.height,src);
                app.drawObj(self.cnv);
                document.getElementById("filepicker").value = "";
            };
        });

        document.querySelector(".color-show.foreground").addEventListener("click",function(e) {
            document.getElementById("foreground-color").click();
            e.currentTarget.style.zIndex = 2;
            document.querySelector(".color-show.background").style.zIndex = 1;

        });

        document.querySelector(".color-show.background").addEventListener("click",function(e) {
            document.getElementById("background-color").click();
            e.currentTarget.style.zIndex = 2;
            document.querySelector(".color-show.foreground").style.zIndex = 1
        });

        document.getElementById("foreground-color").addEventListener("input",function(e){
            document.querySelector(".color-show.foreground").style.backgroundColor = e.currentTarget.value
            app.foreground(e.target.value);
        });

        document.getElementById("background-color").addEventListener("input",function(e) {
            document.querySelector(".color-show.background").style.backgroundColor = e.currentTarget.value
            app.background(e.target.value);
            app.drawObj(self.cnv);
        });


        self.cnv.addEventListener('mousedown',function(ev) {
            if(app.mode == "brush" || ev.shiftKey) {
                drag(ev,self.cnv);
            } else {
                makenewitem(ev,self.cnv);
            }
        },false);

        self.cnv.addEventListener('mousemove',function(ev) {
            let {mx,my}  = getMouseCoords(ev)
        
            if(mousedown && app.mode == "brush") {
                app.drawBrush(mx,my);
                app.drawObj(self.cnv);
            }

        },false);

        self.cnv.addEventListener('mouseup',function() {
            mousedown = false;
        },false);

        self.cnv2.addEventListener('click', selectitem,false);


    }
    getState(state) {
      return this.state;
    }

}


window.onload = function(){
    let ui = new UI_manager();
    ui.setState("shape");
};


//Helper functions
function getMouseCoords(ev){
    let mx = null;
    let my = null;

    if(ev.layerX || ev.layerX === 0) {
        mx = ev.layerX;
        my = ev.layerY;
    } else if(ev.offsetX || ev.offsetX === 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }else{
     }
   
    return {mx,my}

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

//use shift for drag
function drag(ev,cnv) {
    let { mx,my } = getMouseCoords(ev)

    if(app.mode == "brush") {
        mousedown = true;

    } else {
        if(app.dragObj(mx,my)) {
            cnv = document.getElementById('main');
            cnv.style.cursor = "pointer";
            cnv.addEventListener('mousemove',move,false);
            cnv.addEventListener('mouseup',drop,false);
        }
    }
}

//Drag & Drop operation
//move
function move(ev) {
    var cnv = document.getElementById('main');

    let { mx,my } = getMouseCoords(ev);
    mx = ev.movementX;
    my = ev.movementY;


    app.moveObj(mx,my);
    drawCanvasRect(cnv);
    app.drawObj(cnv);

}

//Drag & Drop operation
//drop
function drop(cnv) {
        var cnv = document.getElementById('main');
        cnv.removeEventListener('mousemove',move,false);
        cnv.removeEventListener('mouseup',drop,false);
        cnv.style.cursor = "crosshair";
}

//Insert a new Object on Canvas
//dblclick Event
function makenewitem(ev,cnv) {
    let { mx,my } = getMouseCoords(ev)

    if(app.mode == "shape"){
        if(!app.selected_obj && app.insertObj(mx,my)) {
            drawCanvasRect(cnv);
            app.drawObj(cnv);
        } else {
            if(app.selected_obj){
                makeselecteditem(ev,cnv);

            }
        }
    }

    if(app.mode == "text"){
        var text = prompt("Texto a escrever");
        if(text){
            var fontfamily = document.getElementById("font_family").value
            var fontsize = document.getElementById("font_size").value
           
            if(!fontsize){
                fontsize = "12px";
            }
            fontsize = fontsize.replace("px","")
            app.drawText(mx,my,fontsize,fontfamily,text);
            app.drawObj(cnv);
        }
      
    }
}

function makeselecteditem(ev,cnv) {
    if(app.mode == "shape") {
        let { mx,my } = getMouseCoords(ev)

        if(app.insertSelectedObj(mx,my)) {
            drawCanvasRect(cnv);
            app.drawObj(cnv);
        }
    }
}

function selectitem(ev) {
    let { mx,my } = getMouseCoords(ev)

    if(app.selectObj(mx,my)) {
        //drawCanvasRect(cnv);
        //app.drawObj(cnv);
    }
}

//Save button
//Onclick Event
function saveasimage(cnv) {
    try {
        let link = document.createElement("a");
        link.download = "imagecanvas.png";
        link.href = cnv.toDataURL("image/png").replace("image/png","image/octet- stream");
        link.click();
    } catch(err) {
        alert("You need to change browsers OR upload the file to a server.");
    }
}