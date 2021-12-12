const imgInput = document.getElementById('image-input');
const pixelInput = document.getElementById('pixel-input');
const btn = document.getElementById('btn');
const logCont = document.getElementById('log-container');

btn.addEventListener('click', function() {
  const targetImgSize = pixelInput.value;
  const file = imgInput.files[0]

  if (file && targetImgSize) {
    resize(file, targetImgSize);
  } else if (!file) {
    printError('File is not selected.');
  } else if (!targetImgSize) {
    printError('Target pixel size is not specified.');
  } else {
    printError('Unexpected error.');
  }
});

function resize(file, targetImgSize) {
  const reader = new FileReader();

  reader.onload = function(readerOnloadE) {
    const img = document.createElement('img');

    img.onload = function() {
      // Calculate sizes
      const naturalArea = this.naturalWidth * this.naturalHeight; // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalWidth
      printLog(`The original size of the image is: ${this.naturalWidth} x ${this.naturalHeight} = ${naturalArea} pixels.`);

      const areaAdjustingRatio = targetImgSize / naturalArea;
      const sideAdjustingRatio = Math.sqrt(areaAdjustingRatio);

      const adjustedWidth  = Math.floor(this.naturalWidth * sideAdjustingRatio);
      const adjustedHeight = Math.floor(this.naturalHeight * sideAdjustingRatio);
      printLog(`The resized image will be: ${adjustedWidth} x ${adjustedHeight} = ${adjustedWidth * adjustedHeight} pixels.`);
      printLog(`The resized image will be about ${Math.floor(naturalArea / (adjustedWidth * adjustedHeight) * 10000) / 10000} times smaller than the original image.`);

      // Dynamically create a canvas element
      const canvas = document.createElement('canvas');
      canvas.height = adjustedHeight;
      canvas.width = adjustedWidth;

      // Resize the image
      printLog('Resizing the image...');
      canvas.getContext('2d').drawImage(img, 0, 0, this.naturalWidth, this.naturalHeight, 0, 0, adjustedWidth, adjustedHeight); // @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

      // Preview the resized image
      printLog('Previewing the resized image...');
      document.getElementById('preview').src = canvas.toDataURL(file.type);

      printLog('Done!');
    }

    img.src = readerOnloadE.target.result;
  }

  reader.readAsDataURL(file);
}

function printLog(text) {
  const timestamped = timestamp(text);

  // Print in the browser console.
  console.log(timestamped);
  
  // Print in the screen.
  const p = createLogElememnt(timestamped);
  logCont.appendChild(p);

  autoScrollLogs()
}

function printError(text) {
  const timestamped = timestamp(text);

  // Print in the browser console.
  console.error(timestamped);
  
  // Print in the screen.
  const p = createLogElememnt(timestamped);
  p.className += ' error';
  logCont.appendChild(p);

  autoScrollLogs()
}

function createLogElememnt(text) {
  const p = document.createElement('p');
  p.innerText = text;
  return p;
}

function timestamp(text) {
  date = new Date();
  return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${text}`;
}

function autoScrollLogs() {
  logCont.scrollTop = logCont.scrollHeight;
}