import { useEffect } from "react";

function App() {
  const draw = (ctx, xLast, yLast, brushDiameter, x, y) => {
    ctx.strokeStyle = "rgba(255,255,255," + (0.4 + Math.random() * 0.2) + ")";
    ctx.beginPath();
    ctx.moveTo(xLast, yLast);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Chalk Effect
    var length = Math.round(
      Math.sqrt(Math.pow(x - xLast, 2) + Math.pow(y - yLast, 2)) /
        (5 / brushDiameter)
    );
    var xUnit = (x - xLast) / length;
    var yUnit = (y - yLast) / length;
    for (var i = 0; i < length; i++) {
      var xCurrent = xLast + i * xUnit;
      var yCurrent = yLast + i * yUnit;
      var xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
      var yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
      ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
    }
  };

  useEffect(() => {
    const cursor = document.querySelector(".chalk");
    var canvas = document.getElementById("chalkboard");
    canvas.width = window.screen.width;
    canvas.height = window.screen.height;

    var ctx = canvas.getContext("2d");

    var width = canvas.width;
    var height = canvas.height;
    var mouseX = 0;
    var mouseY = 0;
    var mouseD = false;
    var xLast = 0;
    var yLast = 0;
    var brushDiameter = 7;

    canvas.style.cursor = "none";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = brushDiameter;
    ctx.lineCap = "round";

    document.addEventListener("onselectstart", () => {
      return;
    });

    const touchMove = function (evt) {
      var touch = evt.touches[0];
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      if (mouseY < height && mouseX < width) {
        evt.preventDefault();
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";

        if (mouseD) {
          draw(ctx, xLast, yLast, brushDiameter, mouseX, mouseY);
          xLast = mouseX;
          yLast = mouseY;
        }
      }
    };

    const touchStart = function (evt) {
      //evt.preventDefault();
      var touch = evt.touches[0];
      mouseD = true;
      mouseX = touch.pageX;
      mouseY = touch.pageY;
      xLast = mouseX;
      yLast = mouseY;
      draw(ctx, xLast, yLast, brushDiameter, mouseX, mouseY);
      xLast = mouseX;
      yLast = mouseY;
    };

    document.addEventListener("touchmove", touchMove, false);

    document.addEventListener("touchstart", touchStart, false);
    document.addEventListener(
      "touchend",
      function (evt) {
        mouseD = false;
      },
      false
    );

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = brushDiameter;
    ctx.lineCap = "round";

    const onMouseMove = function (evt) {
      mouseX = evt.pageX;
      mouseY = evt.pageY;
      if (mouseY < height && mouseX < width) {
        cursor.style.left = mouseX - 0.5 * brushDiameter + "px";
        cursor.style.top = mouseY - 0.5 * brushDiameter + "px";
        if (mouseD) {
          draw(ctx, xLast, yLast, brushDiameter, mouseX, mouseY);
          xLast = mouseX;
          yLast = mouseY;
        }
      } else {
        cursor.style.top = height - 10 + "px";
      }
    };

    const onMouseDown = function (evt) {
      mouseD = true;
      xLast = mouseX;
      yLast = mouseY;
      draw(ctx, xLast, yLast, brushDiameter, mouseX + 1, mouseY + 1);
      xLast = mouseX + 1;
      yLast = mouseY + 1;
    };

    const onMouseUp = function (evt) {
      mouseD = false;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("onselectstart", () => {
        return;
      });

      document.removeEventListener("touchmove", touchMove, false);

      document.removeEventListener("touchstart", touchStart, false);
      document.removeEventListener(
        "touchend",
        function (evt) {
          mouseD = false;
        },
        false
      );
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };

    // return (_) => {
    //   document.removeEventListener("mousemove", onMouseMove);
    //   document.removeEventListener("onselectstart", () => {
    //     return;
    //   });
    // };
  }, [draw]);

  return (
    <div
      className="h-full m-0 p-0 overflow-hidden"
      style={{
        cursor: "none",
      }}
    >
      <canvas
        className="absolute top-0 left-0 w-full h-full z-10"
        style={{
          background:
            "url(https://raw.github.com/mmoustafa/Chalkboard/master/img/bg.png)",
        }}
        id="chalkboard"
      />
      <div className="chalk" />
    </div>
  );
}
export default App;
