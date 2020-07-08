let keysActive = true;
let looping = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "/Volumes/Volumina/frames/complex-swirl/waves2/sketch";
let maxFrames = 241;
let drawCount = 0;

let w, h, w2, h2, incX, incY;

let time = 0;

function setup() {
    socket = io.connect('http://localhost:8080');
    // pixelDensity(1);
    cnvs = createCanvas(600, 600);
    ctx = cnvs.drawingContext;
    canvasDOM = document.getElementById('defaultCanvas0');
    fill(0);
    noFill();

    stroke(0)
    //     strokeWeight(0.75);
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

draw = function() {
    background(255);
    translate(w2, h2);
    let num = 30 * 16;
    let inc = TWO_PI / num;
    drawCount = map(sin(time), -1, 1, -100, 100);
    // drawCount = 100;
    time += inc;
    // fill(0);
    let prev = { x: null, y: null };

    let t = frameCount * 0.125 * 0.25;

    for (let y = -h2; y <= h2 - incY; y += incY) {
        beginShape();
        for (let x = -w2; x <= w2; x += 0.1) {
            let c = new Complex(x, y);
            let d = dist(x, y, 0, 0) * 1;
            let dr = 1 / dist(x, y, 0, 0) * 1;
            d = map(drawCount + 0, 0, 5, 0, d);
            dr = map(drawCount + 0, 0, 5, 0, dr);
            let sc = new Complex(sin(d * 0.005) * dr, cos(dr));
            c.multiply(sc);
            let v = c.plot();
            let xx = v.x * 1.5;
            let yy = v.y * 1.5;
            vertex(xx, yy);
        }
        endShape();
    }

    for (let x = -w2; x <= w2 - incX; x += incX) {
        beginShape();
        for (let y = -h2; y <= h2; y += 0.1) {
            let c = new Complex(x, y);
            let d = dist(x, y, 0, 0) * 1;
            let dr = 1 / dist(x, y, 0, 0) * 1;
            d = map(drawCount + 0, 0, 5, 0, d);
            dr = map(drawCount + 0, 0, 5, 0, dr);
            let sc = new Complex(sin(d * 0.005) * dr, cos(dr));
            c.multiply(sc);
            let v = c.plot();
            let xx = v.x * 1.5;
            let yy = v.y * 1.5;
            vertex(xx, yy);
        }
        endShape();
    }

    // for (let x = -w2 + incX; x <= w2 - incX; x += incX) {
    //     beginShape();
    //     for (let y = -h2 + incY; y <= h2 - incY; y += incY) {
    //         let c = new Complex(x, y);
    //         let d = dist(x, y, 0, 0) * 1;
    //         let dr = 1 / dist(x, y, 0, 0) * 1;
    //         d = map(drawCount + 0, 0, 5, 0, d);
    //         dr = map(drawCount + 0, 0, 5, 0, dr);
    //         //             dr = 0.75;
    //         let sc = new Complex(sin(d * 0.005) * dr, cos(dr));
    //         c.multiply(sc);
    //         let v = c.plot();
    //         let xx = v.x;
    //         let yy = v.y;
    //         vertex(xx * 1.5 * 1, yy * 1.5 * 1);
    //     }
    //     endShape();
    // }
    // for (let y = -h2 + incY; y <= h2 - incY; y += incY) {
    //     beginShape();
    //     for (let x = -w2 + incX; x <= w2 - incX; x += incX) {
    //         let c = new Complex(x, y);
    //         let d = dist(x, y, 0, 0) * 1;
    //         let dr = 1 / dist(x, y, 0, 0) * 1;
    //         d = map(drawCount + 0, 0, 5, 0, d);
    //         dr = map(drawCount + 0, 0, 5, 0, dr);
    //         //             dr = 0.75;
    //         let sc = new Complex(sin(d * 0.005) * dr, cos(dr));
    //         c.multiply(sc);
    //         let v = c.plot();
    //         let xx = v.x;
    //         let yy = v.y;
    //         vertex(xx * 1.5 * 1, yy * 1.5 * 1);
    //     }
    //     endShape();
    // }
    drawCount++;
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
}
// redraw();
// drawCount = 10;

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