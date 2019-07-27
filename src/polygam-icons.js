function newIcon(iIcon, iScale = 1)
{
  switch(iIcon)
  {
    case "trash" :
      let trashBinPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
      trashBinPath1.setAttribute("d", "M446,70H344.8V53.5c0-29.5-24-53.5-53.5-53.5h-96.2c-29.5,0-53.5,24-53.5,53.5V70H40.4c-7.5,0-13.5,6-13.5,13.5    S32.9,97,40.4,97h24.4v317.2c0,39.8,32.4,72.2,72.2,72.2h212.4c39.8,0,72.2-32.4,72.2-72.2V97H446c7.5,0,13.5-6,13.5-13.5    S453.5,70,446,70z M168.6,53.5c0-14.6,11.9-26.5,26.5-26.5h96.2c14.6,0,26.5,11.9,26.5,26.5V70H168.6V53.5z M394.6,414.2    c0,24.9-20.3,45.2-45.2,45.2H137c-24.9,0-45.2-20.3-45.2-45.2V97h302.9v317.2H394.6z");
      trashBinPath1.setAttribute("transform", `scale(${0.05 * iScale})`);
      
      let trashBinPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
      trashBinPath2.setAttribute("d", "M243.2,411c7.5,0,13.5-6,13.5-13.5V158.9c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v238.5    C229.7,404.9,235.7,411,243.2,411z");
      trashBinPath2.setAttribute("transform", `scale(${0.05 * iScale})`);
      
      let trashBinPath3 = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
      trashBinPath3.setAttribute("d", "M155.1,396.1c7.5,0,13.5-6,13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v208.9    C141.6,390.1,147.7,396.1,155.1,396.1z");
      trashBinPath3.setAttribute("transform", `scale(${0.05 * iScale})`);
      
      let trashBinPath4 = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
      trashBinPath4.setAttribute("d", "M331.3,396.1c7.5,0,13.5-6,13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v208.9    C317.8,390.1,323.8,396.1,331.3,396.1z");
      trashBinPath4.setAttribute("transform", `scale(${0.05 * iScale})`);

      let trashBin = document.createElementNS("http://www.w3.org/2000/svg", "svg"); 
      trashBin.setAttribute("height", 24 * iScale);
      trashBin.setAttribute("width", 24 * iScale);
      trashBin.appendChild(trashBinPath1);
      trashBin.appendChild(trashBinPath2);
      trashBin.appendChild(trashBinPath3);
      trashBin.appendChild(trashBinPath4);

      return trashBin;

      case "saw" :
        let sawPath = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
        sawPath.setAttribute("d", "M 1.0101002,16.023404 14.61972,2.413778 v 27.219256 l 13.609631,-13.60963");
        sawPath.setAttribute("style","fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" );
        sawPath.setAttribute("transform", `scale(${iScale})`);

        let saw = document.createElementNS("http://www.w3.org/2000/svg", "svg"); 
        saw.setAttribute("height", 35 * iScale);
        saw.setAttribute("width", 35 * iScale);
        saw.appendChild(sawPath);
        return saw;

      case "sine" :
        let sinePath = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
        sinePath.setAttribute("d", "m 6.7671069,22.06957 c 0,0 7.1761601,-29.5278369 14.3523171,0 7.17615,29.527827 14.35231,0 14.35231,0");
        sinePath.setAttribute("style", "fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1");
        sinePath.setAttribute("transform", `scale(${iScale})`);

        let sineCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); 
        sineCircle.setAttribute("cx", "21.166668");
        sineCircle.setAttribute("cy", "21.171869");
        sineCircle.setAttribute("r", "21.068539");
        sineCircle.setAttribute("style", "fill:none;stroke:#000000;stroke-width:1;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1");
        sineCircle.setAttribute("transform", `scale(${iScale})`);

        let sine = document.createElementNS("http://www.w3.org/2000/svg", "svg"); 
        sine.setAttribute("height", 50);
        sine.setAttribute("width", 50);
        sine.appendChild(sineCircle);
        sine.appendChild(sinePath);
        return sine;

      case "square" :
        let squarePath = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
        squarePath.setAttribute("d", "M 0.99299172,14.579069 V 0.97062462 H 14.651321 V 28.187509 H 28.30966 v -13.60844");
        squarePath.setAttribute("style", "fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1");
        squarePath.setAttribute("transform", `scale(${iScale})`);

        let square = document.createElementNS("http://www.w3.org/2000/svg", "svg"); 
        square.setAttribute("height", 38 * iScale);
        square.setAttribute("width", 38 * iScale);
        square.appendChild(squarePath);
        return square;

      case "triangle" :
        let trianglePath = document.createElementNS("http://www.w3.org/2000/svg", "path"); 
        trianglePath.setAttribute("d", "M 1.0381963,15.882691 7.843006,2.2730653 21.452636,29.492321 28.257447,15.882691");
        trianglePath.setAttribute("style", "fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1");
        trianglePath.setAttribute("transform", `scale(${iScale})`);

        let triangle = document.createElementNS("http://www.w3.org/2000/svg", "svg"); 
        triangle.setAttribute("height", 38 * iScale);
        triangle.setAttribute("width", 38 * iScale);
        triangle.appendChild(trianglePath);
        return triangle;

    default : 
      console.log("Invalid icon request");
      break;
  }
}

