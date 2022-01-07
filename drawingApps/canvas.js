var socket = io();
window.addEventListener("load",()=>{
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    socket.emit("canvas", canvas.toDataURL());

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // ctx.beginPath();
    // ctx.moveTo(100,100);
    // ctx.lineTo(200,100);
    // ctx.stroke();

    let painting = false;

    function start(e){
        painting = true;
        draw(e);
    }

    function end(){
        painting = false;
        ctx.beginPath();
    }

    function draw(e){
        if(!painting) return
        ctx.lineCap ='round';
        ctx.lineWidth=10;

        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX,e.clientY);
        socket.emit("canvas", canvas.toDataURL());
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", custom);

});

function custom(event){
    var el = document.getElementById("hov");
      el.style.top = event.clientY + "px";
      el.style.left = event.clientX + "px";
      socket.emit("canvas", canvas.toDataURL());
}