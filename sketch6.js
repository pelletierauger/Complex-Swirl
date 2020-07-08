let keysActive = true;
let looping = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "/Volumes/Volumina/frames/complex-swirl/webgl/sketch";
let maxFrames = 1000;

let walkers = [];

let w2, h2, incX, incY;

function setup() {
    socket = io.connect('http://localhost:8080');
    socket.emit('msg', "Bonjour !");
    // pixelDensity(1);
    cnvs = createCanvas(600, 600);
    ctx = cnvs.drawingContext;
    canvasDOM = document.getElementById('defaultCanvas0');
    frameRate(30);
    noFill();
    stroke(0);
    strokeWeight(0.75);
    w2 = width /  2;
    h2 = height /  2;
    incX = width / 20 * 0.25;
    incY = height / 20 * 0.25;

    for (let i = 0; i < 60; i++) {
        let x = 10 + Math.round(Math.random() * 60);
        let y = 10 + Math.round(Math.random() * 60);
        let w = { x: x, y: y };
        walkers.push(w);
    }

    if (!looping) {
        noLoop();
    }
}

draw = function() {
    background(255);
    translate(w2, h2);
    scale(1.542, 1.542);
    let t = Math.abs(Math.sin((frameCount - 1) * 1e-2)) * 16;
    let rs = 5e-3;
    for (let x = -w2 + incX; x <= w2 - incX; x += incX) {
        beginShape();
        for (let y = -h2 + incY; y <= h2 - incY; y += incY) {
            let c = new Complex(x, y);
            let d = dist(x, y, 0, 0) * t;
            let dr = 1 / dist(x, y, 0, 0) * t;
            let sc = new Complex(Math.sin(d * rs) * dr, Math.cos(dr));
            c.multiply(sc);
            let v = c.plot();
            vertex(v.x, v.y);
        }
        endShape();
    }
    for (let y = -h2 + incY; y <= h2 - incY; y += incY) {
        beginShape();
        for (let x = -w2 + incX; x <= w2 - incX; x += incX) {
            let c = new Complex(x, y);
            let d = dist(x, y, 0, 0) * t;
            let dr = 1 / dist(x, y, 0, 0) * t;
            let sc = new Complex(Math.sin(d * rs) * dr, Math.cos(dr));
            c.multiply(sc);
            let v = c.plot();
            vertex(v.x, v.y);
        }
        endShape();
    }

    for (let i = 0; i <  walkers.length; i++) {
        let x0 = -w2 + incX + (incX * walkers[i].x);
        let x1 = -w2 + incX + (incX * (walkers[i].x + 1));
        let y0 = -h2 + incY + (incY * walkers[i].y);
        let y1 = -h2 + incY + (incY * (walkers[i].y + 1));

        let c0 = new Complex(x0, y0);
        let c1 = new Complex(x1, y0);
        let c2 = new Complex(x0, y1);
        let c3 = new Complex(x1, y1);

        let d0 = dist(x0, y0, 0, 0) * t;
        let dr0 = 1 / dist(x0, y0, 0, 0) * t;

        let d1 = dist(x1, y0, 0, 0) * t;
        let dr1 = 1 / dist(x1, y0, 0, 0) * t;

        let d2 = dist(x0, y1, 0, 0) * t;
        let dr2 = 1 / dist(x0, y1, 0, 0) * t;

        let d3 = dist(x1, y1, 0, 0) * t;
        let dr3 = 1 / dist(x1, y1, 0, 0) * t;

        let sc0 = new Complex(Math.sin(d0 * rs) * dr0, Math.cos(dr0));
        c0.multiply(sc0);

        let sc1 = new Complex(Math.sin(d1 * rs) * dr1, Math.cos(dr1));
        c1.multiply(sc1);

        let sc2 = new Complex(Math.sin(d2 * rs) * dr2, Math.cos(dr2));
        c2.multiply(sc2);

        let sc3 = new Complex(Math.sin(d3 * rs) * dr3, Math.cos(dr3));
        c3.multiply(sc3);

        let v0 = c0.plot();
        let v1 = c1.plot();
        let v2 = c2.plot();
        let v3 = c3.plot();

        fill(0);
        beginShape();
        vertex(v0.x, v0.y);
        vertex(v1.x, v1.y);
        vertex(v3.x, v3.y);
        vertex(v2.x, v2.y);
        endShape();
        noFill();
        if (Math.random() > 0.7) {
            if (Math.random() >  0.5) {
                walkers[i].x += random([-1, 1]);
            } else {
                walkers[i].y += random([-1, 1]);
            }
        }
    }
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
}

function keyPressed() {
    if (keysActive) {
        if (keyCode === 32) {
            if (looping) {
                noLoop();
                looping = false;
            } else {
                loop();
                looping = true;
            }
        }
        if (key == 'p' || key == 'P') {
            frameExport();
        }
        if (key == 'r' || key == 'R') {
            window.location.reload();
        }
        if (key == 'm' || key == 'M') {
            redraw();
        }
    }
}