function imgToBase64(url, callback) {
  var image = new Image();
  image.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
    canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
    canvas.getContext('2d').drawImage(this, 0, 0);
    callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
  };
  image.src = url;
}
