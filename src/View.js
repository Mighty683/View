const EventObject = require('event-driven-object')
const Model = require('event-driven-object')
const HTMLEngine = require('./HTMLEngine')

View.prototype = Object.create(EventObject.prototype)

View.prototype.render = function (withoutClear) {
  withoutClear || this.clear()
  let position = withoutClear ? 'beforeend' : 'afterbegin'
  this.rootEl.insertAdjacentHTML(position, this._evalTemplate(this.template))
  this.mapUI()
  if (typeof this.onRender === 'function') {
    this.onRender(this)
  }
  this.emit('render', this)
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
      this._ui[key] = this.rootEl.querySelector(this.ui[key])
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

View.prototype.showCollection = function (uiName, childViews) {
  childViews.forEach(function (childView) {
    childView.rootEl = this.getUI(uiName)
    childView.render(true)
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

  this.rootEl = options.rootEl
  this.ui = options.ui
  this.template = options.template
  this.model = options.model || new Model()

  this._childViews = {}
  this._ui = {}
}

module.exports = View
