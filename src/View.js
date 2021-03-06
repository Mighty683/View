var EventDriver = require('./Event-Driver')
var HTMLEngine = require('./HTMLEngine')
var UiFunctions = require('./uiFunctions')
var polyFills = require('./polyFills.js')

View.prototype = Object.create(EventDriver.prototype)

View.prototype._show = function (options) {
  var withoutClear = options && options.withoutClear
  if (this.element && !this._rendered) {
    var element = this._render(document.createElement(this.element), withoutClear)
    this.rootEl.insertAdjacentElement('beforeend', element)
    this.rootEl = element
  } else {
    this._render(this.rootEl, withoutClear)
  }
}

View.prototype._render = function (element, withoutClear) {
  element = element || this.rootEl
  withoutClear || this.clear()
  this.template && element.insertAdjacentHTML('beforeend', this._evalTemplate(this.template))
  this.classList && UiFunctions.addClass.call(element, this.classList)
  this.ui && this.mapUI()
  this.uiEvents && this._setEvents()
  this._rendered = true
  this.emit('render', this)
  if (typeof this.onRender === 'function') {
    this.onRender(this)
  }
  return element
}

View.prototype.show = function () {
  if (arguments[0] instanceof View) {
    var view = arguments[0]
    view.rootEl = this.rootEl
    view.element = view.element || arguments[1]
    this._childViews['rootEl'] = view
    view._show()
  } else if (typeof arguments[0] === 'string') {
    if (arguments[1] instanceof View) {
      this._showChild.apply(this, arguments)
    } else if (arguments[1] instanceof Array) {
      this._showCollection.apply(this, arguments)
    }
  } else {
    this._show()
  }
}

View.prototype._showChild = function (uiName, childView) {
  childView.rootEl = this.getUI(uiName)
  this._childViews[uiName] = childView
  childView._show()
}

View.prototype.clear = function () {
  while (this.rootEl.firstChild) this.rootEl.removeChild(this.rootEl.firstChild)
}

View.prototype._evalTemplate = function () {
  var templateData = this.templateData || {}
  var modelData = this.model && this.model._attributes ? this.model._attributes : {}
  var data = polyFills._assign(modelData, templateData)
  return HTMLEngine.evalString(this.template, data)
}

View.prototype.mapUI = function () {
  if (this.ui) {
    Object.keys(this.ui).forEach(function (key) {
      var uiElement = this.rootEl.querySelector(this.ui[key])
      if (!uiElement) {
        throw Error('No matching UI element found: ' + key)
      }
      this._ui[key] = uiElement
    }.bind(this))
  }
  this._ui['rootEl'] = this.rootEl
}

View.prototype.getUI = function (uiName) {
  return polyFills._assign(this._ui[uiName], UiFunctions)
}

View.prototype._showCollection = function (uiName, childViews, element) {
  childViews.forEach(function (childView) {
    childView.element = childView.element || element
    childView.rootEl = this.getUI(uiName)
    childView._show({
      withoutClear: true
    })
  }.bind(this))
  this._childViews[uiName] = childViews
}
View.prototype.removeChild = function (child) {
  if (typeof child === 'string') {
    if (this._childViews[child] && this._childViews[child] instanceof Array) {
      this._childViews[child].forEach(function (childView) {
        childView.hide()
      })
    } else if (this._childViews[child]) {
      this._childViews[child].hide()
    }
    delete this._childViews[child]
  } else if (child instanceof View) {
    Object.keys(this._childViews).forEach(function (key) {
      if (this._childViews[key] === child) {
        child.hide()
        delete this._childViews[key]
      }
    }.bind(this))
  }
}

View.prototype.removeAllChild = function () {
  if (this._childViews) {
    Object.keys(this._childViews).forEach(function (key) {
      if (this._childViews[key] instanceof View) {
        this._childViews[key].hide()
      }
      delete this._childViews[key]
    }.bind(this))
  }
}

View.prototype.getChilds = function () {
  return this._childViews
}

View.prototype.hide = function () {
  this.removeAllChild()
  this.clear()
  this.emit('hide', this)
}

View.prototype._setEvents = function () {
  for (var prop in this.uiEvents) {
    if (this.uiEvents.hasOwnProperty(prop)) {
      var ar = prop.split(/ @| /)
      var fun = null
      if (typeof this.uiEvents[prop] === 'string') {
        fun = this[this.uiEvents[prop]]
      } else if (typeof this.uiEvents[prop] === 'function') {
        fun = this.uiEvents[prop]
      }
      this.getUI(ar[1]).addEventListener(ar[0], fun, ar[2])
    }
  }
}

function View (options) {
  EventDriver.call(this)
  this._childViews = {}
  this._ui = {}
  if (options) {
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        this[prop] = options[prop]
      }
    }
  }
}

module.exports = View
