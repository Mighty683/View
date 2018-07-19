const EventDriver = require('../../index.js').EventDriver

describe('Event-Driver', function () {
  it('should be defined', function () {
    expect(EventDriver).toBeDefined()
  })

  describe('listen/emit', function () {
    beforeEach(function () {
      this.testFun = function () {}
      spyOn(this, 'testFun').and.returnValue('text')
      this.ed = new EventDriver()
    })

    it('should listen to event', function () {
      this.ed.on('event', this.testFun)
      this.ed.emit('event', 2, 3)
      expect(this.testFun).toHaveBeenCalledWith(2, 3)
    })

    it('should listen once', function () {
      this.ed.once('event', this.testFun)
      this.ed.emit('event', 2, 3)
      expect(this.testFun).toHaveBeenCalledWith(2, 3)
      this.ed.emit('event', 2, 3)
      expect(this.testFun.calls.count()).toBe(1)
    })

    it('should override event', function () {
      this.testFun2 = function () {}
      spyOn(this, 'testFun2')
      this.ed.on('event', this.testFun)
      this.ed.on('event', this.testFun2)

      this.ed.emit('event')

      expect(this.testFun2).toHaveBeenCalled()
      expect(this.testFun).not.toHaveBeenCalled()
    })

    it('should return proper value', function () {
      this.ed.on('event', this.testFun)
      expect(this.ed.emit('event')).toBe('text')
    })

    it('should return proper value', function () {
      this.ed.on('event', this.testFun)
      this.ed.removeEvents()
      expect(this.testFun).not.toHaveBeenCalled()
    })
  })

  describe('context passing', function () {
    it('should pass binded context', function () {
      this.ed = new EventDriver()
      this.value = {
        text: 'text'
      }
      this.funtest = function () {
        return this.value
      }.bind(this)

      this.ed.on('event', this.funtest)

      expect(this.ed.emit('event')).toBe(this.value)
    })
  })

  describe('object listener', function () {
    beforeEach(function () {
      this.testFun = function () {}
      spyOn(this, 'testFun')
      this.ed = new EventDriver()
      this.ed2 = new EventDriver()
    })

    it('should add object listener', function () {
      this.ed.listenTo(this.ed2, 'event', this.testFun)
      this.ed2.emit('event')
      expect(this.testFun).toHaveBeenCalled()
    })

    it('should react to proper event listener', function () {
      this.ed.listenTo(this.ed2, 'event2', this.testFun)
      this.ed2.emit('event')
      expect(this.testFun).not.toHaveBeenCalled()
    })

    it('should remove listener', function () {
      this.ed.listenTo(this.ed2, 'event', this.testFun)
      this.ed.stopListenTo(this.ed2, 'event')
      this.ed2.emit('event')
      expect(this.testFun).not.toHaveBeenCalled()
    })
  })
})
