function removeClass (className) {
  if (this.classList.contains(className)) {
    this.classList.remove(className)
  }
}

function toogleClass (className) {
  if (this.classList.contains(className)) {
    this.classList.remove(className)
  } else {
    this.classList.add(className)
  }
}

function addClass (className) {
  if (className instanceof Array) {
    className.forEach(function (_class) {
      if (this.classList && !this.classList.contains(_class)) {
        this.classList.add(_class)
      }
    }.bind(this))
  } else {
    if (this.classList && !this.classList.contains(className)) {
      this.classList.add(className)
    }
  }
}

module.exports = {
  removeClass: removeClass,
  toogleClass: toogleClass,
  addClass: addClass
}
