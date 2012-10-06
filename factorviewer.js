// return a list of all primes below n
function erathostene(n) {
    L = new Array(n);
    for (var i = 2; i < L.length; i++) {
        L[i] = true;
    };
    for (var i=2; i<n; i++) {
        if (L[i]) {
            for (var j=0; (i*i+j*i)<n; j++) {
                L[i*i + j*i] = false;
            }
        }
    }

    f = [];
    for (var i = 0; i<n; i++) {
        if (L[i]) f.push(i);
    };
    return f.reverse();
}

// return a list of the prime factors
function factor(n) {
    if (n == 1) return 1;
    primes = erathostene(~~(Math.sqrt(n))+1); // primes below sqrt(n)
    factors = [];

    for (var i=0; i<primes.length; i++) {
        if (primes[i] * primes[i] > n) break;

        while (n % primes[i] === 0) {
            factors.push(primes[i]);
            n /= primes[i] 
        }
    }

    if (n > 1) factors.push(n);

    return factors
}


// initializing
var canvas,
    canvas2,
    ctx,
    H = window.innerHeight - 200,
    W = H;

canvas = document.getElementById('canvas');
canvas.width = W;
canvas.height = H;

ctx = canvas.getContext( '2d' );


// draw a circle
function drawCircle(top, left, radius, color) {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(top + radius, left + radius, radius, 0, 7, true); 
    ctx.closePath();
    ctx.fill();
}

function draw() {
    canvas.width = canvas.width;
    // print the factorization
    n = document.getElementById('number').value;
    f = factor(n);
    document.getElementById('factorized').innerHTML = n.toString() + " = " + f.join(" * ");

    drawCircle(10, 10, W/2-20, "black");
    var circle = ctx.getImageData(0, 0, W, H);

    // scale the image by ratio < 1
    function scaleImage(image, ratio) {
        // start by copying the original canvas
        var saved = ctx.getImageData(0, 0, W, H);

        // create a new canvas
        canvas2 = document.getElementById("canvas2");
        canvas2.width = W;
        canvas2.height = H;

        // copy image on the new canvas
        ctx2 = canvas2.getContext("2d");
        ctx2.putImageData(image, 0, 0);
        canvas.width = canvas.width;

        // scale the original canvas
        ctx.scale(ratio, ratio);

        // draw the scaled image on the new canvas
        ctx.drawImage(canvas2, 0, 0);
        // scaled image data
        var scaled = ctx.getImageData(0, 0, W*ratio, H*ratio);

        // draw the original canvas back
        canvas.width = canvas.width;
        ctx.putImageData(saved, 0, 0);
        canvas2.height = 0

        return scaled;
    }


    // symmetrically arrange p copies of the image given
    function primeLayout(p, image) {
        canvas.width = canvas.width;
        img = scaleImage(image, 1/(p));
        
        var xc = W/2 - img.width/2 + 1; // center
        var yc = H/2 - img.height/2 + 1;
        var t = 2*Math.PI/p; // angle
        var r = H/2 - 0.5*img.width - 10; // radius

        // special cases
        if (p == 1) {
            ctx.putImageData(img, xc, yc);
        }
        else if (p == 2) {
            ctx.putImageData(img, xc, yc + H/4);
            ctx.putImageData(img, xc, yc - H/4);
        }
        else {
            // actual function
            for (var i = 0; i<p; i++) {
                x = xc + r*Math.cos(i*t-1.57079);
                y = yc + r*Math.sin(i*t-1.57079);
                ctx.putImageData(img, x, y);
            };
        }

        return ctx.getImageData(0, 0, W, H);
    }


    // recursively call primeLayout
    function drawLayout(factors) {
        canvas.width = canvas.width;
        if (factors.length == 1) {
            return primeLayout(factors.shift(), circle);
        }
        else {
            return primeLayout(factors.shift(), drawLayout(factors));
        }
    }

    drawLayout(f);

}
