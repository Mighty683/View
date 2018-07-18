const { strictEqual } = require('assert')
const EventEmitter = require('../index.js')

let testFun, testFunResult
function PrepareTestFun () {
  testFunResult = {
    called: false,
    args: undefined
  }
  testFun = function () {
    testFunResult = {
      called: true,
      args: arguments
    }
  }
}
let DoTest = function (callback) {
  PrepareTestFun()
  callback()
}
// Listen/emit Test
DoTest(function () {
  let model = new EventEmitter()
  model.on('event', testFun)
  model.emit('event', 2, 3)
  strictEqual(testFunResult.called, true)
  strictEqual(testFunResult.args[0], 2)
  strictEqual(testFunResult.args[1], 3)
})

// Listen once Test
DoTest(function () {
  let model = new EventEmitter()
  model.once('event', testFun)
  model.emit('event', 2, 3)
  strictEqual(testFunResult.called, true)
  strictEqual(testFunResult.args[0], 2)
  strictEqual(testFunResult.args[1], 3)
  PrepareTestFun()
  model.emit('event', 2, 3)
  strictEqual(testFunResult.called, false)
})

// Listen and return value from function
DoTest(function () {
  let model = new EventEmitter()
  let fun = function () {
    return 'text'
  }
  model.on('event', fun)
  strictEqual(model.emit('event'), 'text')
})

// Listen once Test shouldn't change context
DoTest(function () {
  let model = new EventEmitter()
  this.lol = {
    text: 'context passing text'
  }
  let fun = function () {
    return this.lol.text
  }
  model.once('event', fun)
  strictEqual(model.emit('event'), 'context passing text')
})

// Remove listener Test
DoTest(function () {
  let model = new EventEmitter()
  model.on('event', testFun)
  model.off('event')
  model.emit('event', 2, 2)
  strictEqual(testFunResult.called, false)
})

// Listen to another object
DoTest(function () {
  let model = new EventEmitter()
  let model2 = new EventEmitter()
  model.listenTo(model2, 'event', testFun)
  model2.emit('event')
  strictEqual(testFunResult.called, true)
})

// should listen only to proper event
DoTest(function () {
  let model = new EventEmitter()
  let model2 = new EventEmitter()
  model.listenTo(model2, 'event2', testFun)
  model2.emit('event')
  strictEqual(testFunResult.called, false)
})

// Should remove listener
DoTest(function () {
  let model = new EventEmitter()
  let model2 = new EventEmitter()
  model.listenTo(model2, 'event', testFun)
  model.stopListenTo(model2, 'event')
  model2.emit('event')
  strictEqual(testFunResult.called, false)
})

// Should remove all events
DoTest(function () {
  let model = new EventEmitter()
  let model2 = new EventEmitter()
  model.listenTo(model2, 'event', testFun)
  model2.removeEvents()
  model2.emit('event')
  strictEqual(testFunResult.called, false)
})
