const targetImgSize = 90*1000

const imgInput = document.getElementById('image-input');

imgInput.addEventListener('change', function(imgInputChangeE) {
  if (imgInputChangeE.target.files) {
    const imgFile = imgInputChangeE.target.files[0];

    const reader = new FileReader();

    reader.onload = function(readerOnloadE) {
      const img = document.createElement('img');

      img.onload = function() {
        // Calculate sizes
        console.log(`The image will be resized to the total area of ${targetImgSize} pixels.`);

        const naturalArea = this.naturalWidth * this.naturalHeight; // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalWidth
        console.log(`The original size of the image is: ${this.naturalWidth} x ${this.naturalHeight} = ${naturalArea} pixels.`);

        const areaAdjustingRatio = targetImgSize / naturalArea;
        const sideAdjustingRatio = Math.sqrt(areaAdjustingRatio);

        const adjustedWidth  = Math.floor(this.naturalWidth * sideAdjustingRatio);
        const adjustedHeight = Math.floor(this.naturalHeight * sideAdjustingRatio);
        console.log(`The resized image will be: ${adjustedWidth} x ${adjustedHeight} = ${adjustedWidth * adjustedHeight} pixels.`);
        console.log(`The resized image will be about ${Math.floor(naturalArea / (adjustedWidth * adjustedHeight) * 10000) / 10000} times smaller than the original image.`);

        // Dynamically create a canvas element
        const canvas = document.createElement('canvas');
        canvas.height = adjustedHeight;
        canvas.width = adjustedWidth;

        // Resize the image
        console.log('Resizing the image...');
        canvas.getContext('2d').drawImage(img, 0, 0, this.naturalWidth, this.naturalHeight, 0, 0, adjustedWidth, adjustedHeight); // @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

        // Preview the resized image
        console.log('Previewing the resized image...');
        document.getElementById('preview').src = canvas.toDataURL(imgFile.type);

        console.log('Done!');
      }

      img.src = readerOnloadE.target.result;
    }

    reader.readAsDataURL(imgFile);
  }
});