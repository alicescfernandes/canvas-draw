'use strict';

//TODO: Hearts are breaking the system
//TODO: Clone & add text;
class FotoPrint{
    constructor() {
        this.thingInMotion = null;
        this.offsetx = null;
        this.offsety = null;
        this.shpinDrawing = new Pool(999999);
        this.object_selector = new Pool(100);
        this.selected_object = "";
        this.background_color = "white";
        this.foreground_color = "black";
        this.mode = "shape";
        this.brush_size = 4;
        this.selected_obj = false;
    }

    setMode(mode) {
        if(mode) {
            this.mode = mode;
        }
    }

    init() {
        let r = new Rect( (260 - 10) / 2, 0, 20, 20, this.foreground_color);
        //this.shpinDrawing.insert(r);
        this.object_selector.insert(r);

        let o = new Oval((260 - 50) / 2 + 30,70,50,0.5,0.5,this.foreground_color);
        //this.shpinDrawing.insert(o);
         this.object_selector.insert(o);


        let b = new Bear(140,200,this.foreground_color);
        //this.shpinDrawing.insert(b);
         this.object_selector.insert(b);


        let g = new Ghost(0+82,330,100,100,this.foreground_color);
        //this.shpinDrawing.insert(g);
         this.object_selector.insert(g);


        let t = new Trapezoid( (260-50) / 2,410,50,20,this.foreground_color);
        //this.shpinDrawing.insert(t);
         this.object_selector.insert(t);


        let h = new Heart(0+125,470,80,this.foreground_color);
        //this.shpinDrawing.insert(h);
        this.object_selector.insert(h);

        let dad = new Picture((260 - 70) / 2, 560, 70, 70, "imgs/allison1.jpg");
        //this.shpinDrawing.insert(dad);
        this.object_selector.insert(dad);
    }

    drawObj(cnv,options) {
        if(!options) options = false;
        this.setBackground(cnv);

        if(options){
            for(let i = 0; i < this.object_selector.stuff.length; i++) {
                this.object_selector.stuff[i].draw(cnv);
            }
            return    
        }
        for (let i = 0; i < this.shpinDrawing.stuff.length; i++) {
            this.shpinDrawing.stuff[i].draw(cnv);
        }
    }

    dragObj(mx, my) {

        let endpt = this.shpinDrawing.stuff.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx, my)) {
                this.offsetx = mx - this.shpinDrawing.stuff[i].posx;
                this.offsety = my - this.shpinDrawing.stuff[i].posy;
                let item = this.shpinDrawing.stuff[i];
                this.thingInMotion = this.shpinDrawing.stuff.length - 1;
                this.shpinDrawing.stuff.splice(i, 1);
                this.shpinDrawing.stuff.push(item);
                return true;
            }
        }
        return false;
    }

    background(color){
        this.background_color = color;
    }

    foreground(color) {
        this.foreground_color = color;
    }
    setBackground(cnv){
        var  ctx = cnv.getContext("2d");
        var width = cnv.width;
        var height = cnv.height;
        ctx.beginPath();
        ctx.rect(0,0,width,height);
        ctx.fillStyle = this.background_color;
        ctx.fill();
        ctx.closePath();

    }
    drawPicture(width,height,src){
        let dad = new Picture(0 + width / 2,0 + height/2,width,height,src);
        this.shpinDrawing.insert(dad);
    }
    drawText(x,y,fontsize,fontfamily,text) {
        let shape = new DrawingText(x,y,fontfamily,text,this.foreground_color,fontsize);
        this.shpinDrawing.insert(shape);
    }
    drawBrush(x,y) {
        let shape = new Brush(x,y,this.brush_size,this.foreground_color);
        this.shpinDrawing.insert(shape);
    }
    moveObj(mx, my) {
        this.shpinDrawing.stuff[this.thingInMotion].setPos(mx,my);
        //this.shpinDrawing.stuff[this.thingInMotion].posx = mx - this.offsetx;
        //this.shpinDrawing.stuff[this.thingInMotion].posy = my - this.offsety;
    }

    removeObj () {
        this.shpinDrawing.remove();
    }

    insertObj (mx, my) {
        let item = null;
        let endpt = this.shpinDrawing.stuff.length-1;

        for (let i = endpt; i >= 0; i--) {
            if (this.shpinDrawing.stuff[i].mouseOver(mx,my)) {
                item = this.cloneObj(this.shpinDrawing.stuff[i]);
                this.shpinDrawing.insert(item);
                return true;
            }
        }
        return false;
    }

    insertSelectedObj(mx,my) {
        this.shpinDrawing.insert(this.makeObj(mx,my));
        return true;
    }

    selectObj(mx,my) {
        let item = null;
        let endpt = this.object_selector.stuff.length - 1;

        for(let i = endpt; i >= 0; i--) {
            if(this.object_selector.stuff[i].mouseOver(mx,my)) {
                this.selected_object = this.object_selector.stuff[i]
                this.selected_obj = true;
                return true;
            }
        }
        return false;
    }

    cloneObj (obj) {
        let item = {};


        let color = this.foreground_color; //obj.color

        switch(obj.name) {
            case "R":
                item = new Rect(obj.posx + 20, obj.posy + 20, obj.w, obj.h, color);
                break;

            case "P":
                item = new Picture(obj.posx + 20, obj.posy + 20, obj.w, obj.h, obj.impath);
                break;

            case "O":
                item = new Oval(obj.posx + 20, obj.posy + 20, obj.r, obj.hor, obj.ver, color);
                break;

            case "H":
                item = new Heart(obj.posx + 20, obj.posy + 20, obj.drx * 4, color);
                break;
            case "S":
                item = new PolyShape(obj.posx + 20,obj.posy + 20,obj.w,obj.h,color);
                break;
            case "G":
                item = new Ghost(this.selected_object.posx,this.selected_object.posy,this.selected_object.width,this.selected_object.height,this.selected_object.color)
                break;

            case "T":
                item = new Trapezoid(this.selected_object.posx,this.selected_object.posy,this.selectObj.width,this.selectObj.height,color);
                break;

            case "B":
                item = new Bear(obj.posx + 20,obj.posy + 20,color);
                break;
            default: throw new TypeError("Can not clone this type of object");
        }
        return item;
    }

    makeObj(x,y) {
        let item = {};

        let color = this.foreground_color; //this.selected_object.color

        switch(this.selected_object.name) {
            case "R":
                item = new Rect(x,y,this.selected_object.w,this.selected_object.h,color);
                break;

            case "P":
                item = new Picture(x,y,this.selected_object.w,this.selected_object.h,this.selected_object.impath);
                break;

            case "O":
                item = new Oval(x,y,this.selected_object.r,this.selected_object.hor,this.selected_object.ver,color);
                break;

            case "H":
                item = new Heart(x,y,this.selected_object.drx * 4,color);
                break;

            case "G":
                item = new Ghost(x,y,this.selected_object.width,this.selected_object.height,color)
                break;

            case "T":
                item = new Trapezoid(x,y,this.selected_object.width,this.selected_object.height,color);
                break;

            case "B":
                item = new Bear(x,y + 20,color);
                break;
            default: throw new TypeError("Can not clone this type of object");
        }
        return item;
    }
}


class Pool
{
    constructor (maxSize) {
        this.size = maxSize;
        this.stuff = [];

    }

    insert (obj) {
        if (this.stuff.length < this.size) {
            this.stuff.push(obj);
        } else {
            alert("The application is full: there isn't more memory space to include objects");
        }
    }

    remove () {
        if (this.stuff.length !== 0) {
            this.stuff.pop();
        } else {
           alert("There aren't objects in the application to delete");
        }
    }
}

