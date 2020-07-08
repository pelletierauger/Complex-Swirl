let looping = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "/Volumes/Volumina/frames/complex-swirl/lines-thinner/sketch";
let maxFrames = 1000;

let w, h, w2, h2, incX, incY;

function setup() {
    socket = io.connect('http://localhost:8080');
    // pixelDensity(1);
    cnvs = createCanvas(600, 600);
    ctx = cnvs.drawingContext;
    canvasDOM = document.getElementById('defaultCanvas0');
    fill(0);
    // noStroke();
    noFill();

    stroke(0)
    strokeWeight(0.75);
    frameRate(1);
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
}

function draw() {
    background(255);
    translate(w2, h2);
    // fill(0);
    let prev = { x: null, y: null };
    let t = frameCount * 0.125 * 0.25;
    for (let x = -w2 + incX; x <= w2 - incX; x += incX) {
        beginShape();
        for (let y = -h2 + incY; y <= h2 - incY; y += incY) {
            let c = new Complex(x, y);
            let d = dist(x, y, 0, 0) * 1e-2;
            d = map(frameCount + 0, 0, 500, 0, d);
            let sc = new Complex(sin(d), cos(d));
            c.multiply(sc);
            let v = c.plot();
            let xx = v.x;
            let yy = v.y;

            // ellipse(xx * 1.5, yy * 1.5, 3);
            // if (prev.x !== null) {
            // stroke(0);
            // line(prev.x, prev.y, xx * 1.5, yy * 1.5);
            // noStroke();
            // }
            vertex(xx * 1.5, yy * 1.5);
            // prev = {x: xx * 1.5, y: yy * 1.5};
        }
        endShape();
    }

    for (let y = -h2 + incY; y <= h2 - incY; y += incY) {
        beginShape();
        for (let x = -w2 + incX; x <= w2 - incX; x += incX) {

            let c = new Complex(x, y);
            let d = dist(x, y, 0, 0) * 1e-2;
            d = map(frameCount + 0, 0, 500, 0, d);
            let sc = new Complex(sin(d), cos(d));
            c.multiply(sc);
            let v = c.plot();
            let xx = v.x;
            let yy = v.y;

            // ellipse(xx * 1.5, yy * 1.5, 3);
            // if (prev.x !== null) {
            // stroke(0);
            // line(prev.x, prev.y, xx * 1.5, yy * 1.5);
            // noStroke();
            // }
            vertex(xx * 1.5, yy * 1.5);
            // prev = {x: xx * 1.5, y: yy * 1.5};
        }
        endShape();
    }
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
}

function keyPressed() {
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