let keysActive = true;
let looping = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "/Volumes/Volumina/frames/complex-swirl/lines-thinner/sketch";
let maxFrames = 1000;
let drawCount = 0;

let walker = { x: 40, y: 40 };
let walkers = [];

let w, h, w2, h2, incX, incY;

function setup() {
    socket = io.connect('http://localhost:8080');
    // pixelDensity(1);
    cnvs = createCanvas(600, 600);
    ctx = cnvs.drawingContext;
    canvasDOM = document.getElementById('defaultCanvas0');
    fill(0);
    noFill();

    stroke(0)
    strokeWeight(0.75);
    frameRate(30);
    incX = width / 20 * 0.25;
    incY = height / 20 * 0.25;
    w = width;
    h = height;
    w2 = w /  2;
    h2 = h /  2;
    let a = 0.001;
    let num = 0;
    if (!looping) {
        noLoop();
    }
    for (let i = 0; i < 60; i++) {
        let x = 10 + Math.round(Math.random() * 60);
        let y = 10 + Math.round(Math.random() * 60);
        let w = { x: x, y: y };
        walkers.push(w);
    }
}

draw = function() {
    background(255);
    translate(w2, h2);
    scale(1.542, 1.542);
    drawCount = map(sin(frameCount * 2e-2), -1, 1, 0, 80);
    // fill(0);
    let prev = { x: null, y: null };
    // let t = frameCount * 0.125 * 0.25;
    let t = drawCount * 0.2
    let count = 0;
    for (let x = -w2 + incX; x <= w2 - incX; x += incX) {
        beginShape();
        count++;
        for (let y = -h2 + incY; y <= h2 - incY; y += incY) {
            let c = new Complex(x, y);
            let d = dist(x, y, 0, 0);
            let dr = 1 / dist(x, y, 0, 0);
            d = map(drawCount, 0, 5, 0, d);
            dr = map(drawCount, 0, 5, 0, dr);
            let sc = new Complex(Math.sin(d * 0.005) * dr, Math.cos(dr));
            c.multiply(sc);
            let v = c.plot();
            let xx = v.x;
            let yy = v.y;
            vertex(xx, yy);
        }
        endShape();
    }
    // console.log(count);
    for (let y = -h2 + incY; y <= h2 - incY; y += incY) {
        beginShape();
        for (let x = -w2 + incX; x <= w2 - incX; x += incX) {
            let c = new Complex(x, y);
            let d = dist(x, y, 0, 0);
            let dr = 1 / dist(x, y, 0, 0);
            d = map(drawCount, 0, 5, 0, d);
            dr = map(drawCount, 0, 5, 0, dr);
            let sc = new Complex(Math.sin(d * 0.005) * dr, Math.cos(dr));
            c.multiply(sc);
            let v = c.plot();
            let xx = v.x;
            let yy = v.y;
            vertex(xx, yy);
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

        let d0 = dist(x0, y0, 0, 0);
        let dr0 = 1 / dist(x0, y0, 0, 0);
        d0 = map(drawCount, 0, 5, 0, d0);
        dr0 = map(drawCount, 0, 5, 0, dr0);

        let d1 = dist(x1, y0, 0, 0);
        let dr1 = 1 / dist(x1, y0, 0, 0);
        d1 = map(drawCount, 0, 5, 0, d1);
        dr1 = map(drawCount, 0, 5, 0, dr1);

        let d2 = dist(x0, y1, 0, 0);
        let dr2 = 1 / dist(x0, y1, 0, 0);
        d2 = map(drawCount, 0, 5, 0, d2);
        dr2 = map(drawCount, 0, 5, 0, dr2);

        let d3 = dist(x1, y1, 0, 0);
        let dr3 = 1 / dist(x1, y1, 0, 0);
        d3 = map(drawCount, 0, 5, 0, d3);
        dr3 = map(drawCount, 0, 5, 0, dr3);

        let sc0 = new Complex(Math.sin(d0 * 0.005) * dr0, Math.cos(dr0));
        c0.multiply(sc0);

        let sc1 = new Complex(Math.sin(d1 * 0.005) * dr1, Math.cos(dr1));
        c1.multiply(sc1);

        let sc2 = new Complex(Math.sin(d2 * 0.005) * dr2, Math.cos(dr2));
        c2.multiply(sc2);

        let sc3 = new Complex(Math.sin(d3 * 0.005) * dr3, Math.cos(dr3));
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
    // drawCount++;
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
}
redraw();
drawCount = 10;

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