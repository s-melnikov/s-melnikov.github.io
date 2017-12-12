/**
 * Complex.js - комплексные числа
 */

class Complex {

  constructor(real, imaginary) {
    if (isNaN(real) || isNaN(imaginary))
      throw  new TypeError()
    this.r = real
    this.i = imaginary
  }

  add(that) {
    return new Complex(
      this.r + that.r,
      this.i + that.i
    )
  }

  mul(that) {
    return new Complex(
      this.r * that.r - this.i * that.i,
      this.r * that.i - this.i * that.r
    )
  }

  mag() {
    return Math.sqrt(this.r * this.r + this.i * this.i)
  }

  neg(){
    return new Complex(-this.r, -this.i)
  }

  toString() {
    return "{" + this.r + "," + this.i + "}"
  }

  equals(that) {
    return that != null &&
      that.constructor === Complex &&
      this.r === that.r &&
      this.i === that.i
  }

  conj() {
    return new Complex(this.r, -this.i)
  }

}

Complex.ZERO = new Complex(0, 0)
Complex.ONE = new Complex(1, 0)
Complex.I = new Complex(0, 1)

Complex._format = /^\{([^,]+),([^}]+)\}$/

Complex.parse = function(s){
  try {
    var m = Complex._format.exec(s)
    return new Complex(parseFloat(m[1]), parseFloat(m[2]))
  } catch (x) {
    throw new TypeError("Строка '" + s + "' не может быть преобразована в комплексное число.")
  }
}