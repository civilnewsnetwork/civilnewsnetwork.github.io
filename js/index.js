var canvas = document.getElementById("c");
var smallW = 300,
    smallH = 140,
    smallDraw = 9,
    medW = 440,
    medH = 210,
    medDraw = 12,
    largeW = 565,
    largeH = 270,
    largeDraw = 16,
    drawWidth;

var colors = [
     "red",
     "orange",
     "yellow",
     "lime",
     "DodgerBlue",
     "blue",
     "BlueViolet",
     "white"
];

var context = canvas.getContext("2d");
var drawCircle = function(color, x, y, radius) {
     context.arc(x, y, radius, 0, Math.PI * 2, 0);
     context.fillStyle = colors[color];
     context.fill();
     context.beginPath();
};

function resize() {
          if (window.innerWidth < 768) {
               width = smallW;
               height = smallH;
               drawWidth = smallDraw;
               canvas.width = width;
               canvas.height = height;
          } 
          else if (window.innerWidth < 1366) {
               width = medW;
               height = medH;
               drawWidth = medDraw;
               canvas.width = width;
               canvas.height = height;
          }
          else {
               width = largeW;
               height = largeH;
               drawWidth = largeDraw;
               canvas.width = width;
               canvas.height = height;
          }

     
     
     for (i = 0; i < 8; i++) {
          drawCircle(
               i,
               canvas.width / 2,
               canvas.width / 2,
               canvas.height - drawWidth * (i + 1)
          );
     }
}

window.addEventListener("resize", resize, false);
resize();







/**
 * Water ripple effect.
 * Original code (Java) by Neil Wallis 
 * @link http://www.neilwallis.com/java/water.html
 * 
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */

(function() {
     
     var smallW = 300,
         smallH = 140,
         smallDraw = 9,
         smallRipple = 64,
         medW = 440,
         medH = 210,
         medDraw = 12,
         medRipple = 256,
         largeW = 565,
         largeH = 270,
         largeDraw = 16,
         largeRipple = 512,
         drawWidth,
         rippleRadius;
     
     
     var canvas = document.getElementById("c1"),
          /** @type {CanvasRenderingContext2D} */
          width = 550,
          height = 400,
          half_width = width >> 1,
          half_height = height >> 1,
          size = width * (height + 2) * 2,
          delay = 10,
          oldind = width,
          newind = width * (height + 3),
          riprad = 3,
          ripplemap = [],
          last_map = [],
          ripple,
          texture;

     if (window.innerWidth < 768) {
          width = smallW;
          height = smallH;
          drawWidth = smallDraw
          rippleRadius = smallRipple;
          canvas.width = width;
          canvas.height = height;
     } 
     else if (window.innerWidth < 1366){
          width = medW;
          height = medH;
          drawWidth = medDraw
          rippleRadius = medRipple;
          canvas.width = width;
          canvas.height = height;
     }
     else {
          width = largeW;
          height = largeH;
          drawWidth = largeDraw
          rippleRadius = largeRipple;
          canvas.width = width;
          canvas.height = height;
     }


     var colors = [
          "#FE76FD",
          "#FFE7FF",
          "#FEFEB3",
          "#FCFE56",
          "#1AFDFE",
          "#00D5FE",
          "#55C9FE",
          "white"
     ];

     var ctx = canvas.getContext("2d");
     var drawCircle = function(color, x, y, radius) {
          ctx.arc(x, y, radius, 0, Math.PI * 2, 0);
          ctx.fillStyle = colors[color];
          ctx.fill();
          ctx.beginPath();
     };
     for (i = 0; i < 8; i++) {
          drawCircle(i, canvas.width / 2, 0, canvas.height - drawWidth * (i + 1));
     }

     texture = ctx.getImageData(0, 0, width, height);
     ripple = ctx.getImageData(0, 0, width, height);

     for (var i = 0; i < size; i++) {
          last_map[i] = ripplemap[i] = 0;
     }

     /**
     * Main loop
     */
     function run() {
          newframe();
          ctx.putImageData(ripple, 0, 0);
     }

     /**
     * Disturb water at specified point
     */
     function disturb(dx, dy) {
          dx <<= 0;
          dy <<= 0;

          for (var j = dy - riprad; j < dy + riprad; j++) {
               for (var k = dx - riprad; k < dx + riprad; k++) {
                    ripplemap[oldind + j * width + k] += rippleRadius;
               }
          }
     }

     /**
     * Generates new ripples
     */
     function newframe() {
          var a, b, data, cur_pixel, new_pixel, old_data;

          var t = oldind;
          oldind = newind;
          newind = t;
          var i = 0;

          // create local copies of variables to decrease
          // scope lookup time in Firefox
          var _width = width,
               _height = height,
               _ripplemap = ripplemap,
               _last_map = last_map,
               _rd = ripple.data,
               _td = texture.data,
               _half_width = half_width,
               _half_height = half_height;

          for (var y = 0; y < _height; y++) {
               for (var x = 0; x < _width; x++) {
                    var _newind = newind + i,
                         _mapind = oldind + i;
                    data =
                         (_ripplemap[_mapind - _width] +
                              _ripplemap[_mapind + _width] +
                              _ripplemap[_mapind - 1] +
                              _ripplemap[_mapind + 1]) >>
                         1;

                    data -= _ripplemap[_newind];
                    data -= data >> 5;

                    _ripplemap[_newind] = data;

                    //where data=0 then still, where data>0 then wave
                    data = 1024 - data;

                    old_data = _last_map[i];
                    _last_map[i] = data;

                    if (old_data != data) {
                         //offsets
                         a =
                              (((x - _half_width) * data / 1024) << 0) +
                              _half_width;
                         b =
                              (((y - _half_height) * data / 1024) << 0) +
                              _half_height;

                         //bounds check
                         if (a >= _width) a = _width - 1;
                         if (a < 0) a = 0;
                         if (b >= _height) b = _height - 1;
                         if (b < 0) b = 0;

                         new_pixel = (a + b * _width) * 4;
                         cur_pixel = i * 4;

                         _rd[cur_pixel] = _td[new_pixel];
                         _rd[cur_pixel + 1] = _td[new_pixel + 1];
                         _rd[cur_pixel + 2] = _td[new_pixel + 2];
                    }

                    ++i;
               }
          }
     }

     var toRun;

     function resize() {
         if (window.innerWidth < 768) {
              width = smallW;
              height = smallH;
              drawWidth = smallDraw
              rippleRadius = smallRipple;
              canvas.width = width;
              canvas.height = height;
         } 
         else if (window.innerWidth < 1366){
              width = medW;
              height = medH;
              drawWidth = medDraw
              rippleRadius = medRipple;
              canvas.width = width;
              canvas.height = height;
         }
         else {
              width = largeW;
              height = largeH;
              drawWidth = largeDraw
              rippleRadius = largeRipple;
              canvas.width = width;
              canvas.height = height;
         }

          clearInterval(toRun);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (i = 0; i < 8; i++) {
               drawCircle(i, canvas.width / 2, 0, canvas.height - drawWidth * (i + 1));
          }
          texture = ctx.getImageData(0, 0, width, height);
          ripple = ctx.getImageData(0, 0, width, height);
          toRun = setInterval(run, delay);
     }

     window.addEventListener("resize", resize, false);
     toRun = setInterval(run, delay);

     
     var toDisturb;
     function disturbb(){
          clearInterval(toDisturb);
          if (drawWidth == 9) {
               toDisturb = setInterval(function() {
                    var xxx = Math.floor(Math.random() * 165) + 65;
                    var yyy = Math.floor(Math.random() * 65);
                    disturb(xxx, yyy);
               }, 400);
          }
          else {
               toDisturb = setInterval(function() {
                    var xxx = Math.floor(Math.random() * 220) + 125;
                    var yyy = Math.floor(Math.random() * 100) + 25;
                    disturb(xxx, yyy);
               }, 100);
          }   
     }
     disturbb();
      window.addEventListener("resize", disturbb, false);
})();