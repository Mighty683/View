const EventObject = require('event-driven-object')
const Model = require('event-driven-object')
const HTMLEngine = require('./HTMLEngine')
const UiFunctions = require('./uiFunctions')

View.prototype = Object.create(EventObject.prototype)

View.prototype.render = function (options) {
  let withoutClear = options && options.withoutClear

  if (this.element) {
    let element = this._render(document.createElement(this.element), withoutClear)
    this.rootEl.insertAdjacentElement('beforeend', element)
    this.rootEl = element
  } else {
    this._render(this.rootEl, withoutClear)
  }
  if (typeof this.onRender === 'function') {
    this.onRender(this)
  }
}

View.prototype._render = function (element, withoutClear) {
  element = element || this.rootEl
  withoutClear || this.clear()
  element.insertAdjacentHTML('beforeend', this._evalTemplate(this.template))
  if (this.classList) {
    UiFunctions.addClass.call(element, this.classList)
  }
  this.mapUI()
  this.emit('render', this)
  return element
}

View.prototype.show = function (view, element) {
  view.rootEl = this.rootEl
  view.element = view.element || element
  view.render()
}

View.prototype.clear = function () {
  while (this.rootEl.firstChild) this.rootEl.removeChild(this.rootEl.firstChild)
}

View.prototype._evalTemplate = function () {
  let templateData = this.templateData || {}
  let modelData = this.model && this.model._attributes ? this.model._attributes : {}
  let data = Object.assign(modelData, templateData)
  return HTMLEngine.evalString(this.template, data)
}

View.prototype.mapUI = function () {
  if (this.ui) {
    Object.keys(this.ui).forEach(function (key) {
      let selector = this.rootEl.querySelector(this.ui[key])
      let uiElement = selector && Object.assign(this.rootEl.querySelector(this.ui[key]), UiFunctions)
      if (!uiElement) {
        throw Error('No matching UI element found"' + key)
      }
      this._ui[key] = uiElement
    }.bind(this))
  }
}

View.prototype.getUI = function (uiName) {
  return this._ui[uiName]
}

View.prototype.showChild = function (uiName, childView) {
  childView.rootEl = this.getUI(uiName)
  this._childViews[uiName] = childView
  childView.render()
}

View.prototype.showCollection = function (uiName, childViews, element) {
  childViews.forEach(function (childView) {
    childView.element = childView.element || element
    childView.rootEl = this.getUI(uiName)
    childView.render({
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
      this._childViews[key].hide()
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

function View (options) {
  EventObject.call(this)
  if (options) {
    this.element = options.element || ''
    this.classList = options.classList || ''
    this.rootEl = options.rootEl
    this.ui = options.ui
    this.template = options.template
    this.templateData = options.templateData
    this.model = options.model || new Model()
  }
  this._childViews = {}
  this._ui = {}
}

module.exports = View
