var id = 0
var _events = {}

EventEmiter.prototype._setEvent = function (listenId, eventName, callback) {
  if (_events[this._listenId]) {
    if (_events[this._listenId][eventName]) {
      _events[this._listenId][eventName][listenId] = callback
    } else {
      _events[this._listenId][eventName] = {}
      _events[this._listenId][eventName][listenId] = callback
    }
  } else {
    _events[this._listenId] = {}
    _events[this._listenId][eventName] = {}
    _events[this._listenId][eventName][listenId] = callback
  }
}

EventEmiter.prototype._unsetEvent = function (listenId, eventName) {
  if (_events[this._listenId] && _events[this._listenId][eventName]) {
    delete _events[this._listenId][eventName][listenId]
  }
}

EventEmiter.prototype.on = function (eventName, callback) {
  this._setEvent(this._listenId, eventName, callback)
}

EventEmiter.prototype.once = function (eventName, callback) {
  this.on(eventName, function () {
    var result = callback.apply(null, Array.prototype.slice.call(arguments))
    this.off(eventName)
    return result
  }.bind(this))
}

EventEmiter.prototype.off = function (eventName) {
  this._unsetEvent(this._listenId, eventName)
}

EventEmiter.prototype.emit = function (eventName) {
  var args = arguments
  var result
  if (_events[this._listenId]) {
    Object.keys(_events[this._listenId]).forEach(function (key) {
      if (key === eventName) {
        var eventsArray = _events[this._listenId][key]
        for (var prop in eventsArray) {
          if (eventsArray.hasOwnProperty(prop)) {
            result = eventsArray[prop].apply(null, Array.prototype.slice.call(args).slice(1))
          }
        }
      }
    }.bind(this))
  }
  return result
}

EventEmiter.prototype.listenTo = function (object, eventName, callback) {
  object._setEvent(this._listenId, eventName, callback)
}

EventEmiter.prototype.stopListenTo = function (object, eventName) {
  object._unsetEvent(this._listenId, eventName)
}

EventEmiter.prototype.removeEvents = function () {
  delete _events[this._listenId]
}

function EventEmiter () {
  this._listenId = id++
}

module.exports = EventEmiter
