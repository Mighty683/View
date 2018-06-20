const EventObject = require('event-driven-object')
const Model = require('event-driven-object')

View.prototype = Object.create(EventObject.prototype)

View.prototype.render = function () {
  this.clear()
  this.rootEl.insertAdjacentHTML('afterbegin', this._evalTemplate(this.template))
  this.emit('render')
}

View.prototype.clear = function () {
  while (this.rootEl.firstChild) this.rootEl.removeChild(this.rootEl.firstChild)
}

View.prototype._evalTemplate = function () {
  let templateData = this.templateData || {}
  let modelData = this.model && this.model._attributes ? this.model._attributes : {}
  let data = Object.assign(modelData, templateData)
  return this._evalString(this.template, data)
}

View.prototype._evalString = function (string, data) {
  if (Object.keys(data).length > 0) {
    return (function () {
      return string.replace(/<\$(.*?)>/g, function (_, code) {
        let scoped = code.replace(/(["'.\w$]+)/g, function (match) {
          return /["']/.test(match[0]) ? match : 'data.' + match
        })
        try {
          return new Function('data', 'return ' + scoped)(data)
        } catch (e) { return scoped.slice(scoped.indexOf('.') + 1) }
      })
    })()
  } else {
    return string
  }
}

View.prototype.getUI = function (uiName) {
  return this.rootEl.querySelector(this.ui[uiName])
}

View.prototype.showChild = function (uiName, childView) {
  childView.rootEl = childView.el = this.getUI(uiName)
  this._childViews[uiName] = childView
  childView.render()
}

View.prototype.removeChild = function (child) {
  if (typeof child === 'string') {
    if (this._childViews[child]) {
      this._childViews[child].hide()
      delete this._childViews[child]
    }
  } else if (child instanceof View) {
    Object.keys(this._childViews).forEach(function (key) {
      if (this._childViews[key] === child) {
        child.hide()
        delete this._childViews[child]
      } else {
        console.log('lol')
      }
    }.bind(this))
  }
}

View.prototype.getChilds = function () {
  return this._childViews
}

View.prototype.hide = function () {
  this.clear()
  this.emit('destroy')
}

function View (options) {
  EventObject.call(this)

  this.rootEl = options.rootEl
  this.ui = options.ui
  this.template = options.template
  this.model = options.model || new Model()

  this._childViews = {}
}

module.exports = View
