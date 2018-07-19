const Model = require('../../index.js').Model

describe('Event-Driver', function () {
  it('should be defined', function () {
    expect(Model).toBeDefined()
  })

  describe('set/get', function () {
    beforeEach(function () {
      this.testFun = function () {}
      spyOn(this, 'testFun')
      this.model = new Model({
        'falseValue': false
      })
      this.model.on('change:value', this.testFun)
    })

    it('should set proper values', function () {
      this.model.set('value', 2)

      expect(this.testFun).toHaveBeenCalledWith(2)
      expect(this.model.get('value')).toBe(2)
      expect(this.model.get('falseValue')).toBe(false)
    })

    it('should set proper values', function () {
      this.model.set({
        value: 1,
        value1: 2
      })

      expect(this.testFun).toHaveBeenCalledWith(1)
      expect(this.model.get('value')).toBe(1)
      expect(this.model.get('value1')).toBe(2)
    })

    it('should unset proper values', function () {
      this.testFun2 = function () {}
      spyOn(this, 'testFun2')
      this.model.set({
        value2: 2
      })
      this.model.on('change:value2', this.testFun2)
      this.model.unset('value')
      this.model.unset('value2')
      expect(this.model.get('value')).toBeUndefined()
      expect(this.testFun).not.toHaveBeenCalled()
      expect(this.testFun2).toHaveBeenCalledWith()
    })

    it('should unset proper values', function () {
      this.testFun2 = function () {}
      spyOn(this, 'testFun2')
      this.model.set({
        value: 1,
        value1: 2,
        value2: 3
      })
      this.model.on('change:value2', this.testFun2)
      this.model.unset({
        value: 1,
        value1: 2
      })
      expect(this.model.get('value')).toBeUndefined()
      expect(this.model.get('value1')).toBeUndefined()
      expect(this.model.get('value2')).toBe(3)
      expect(this.testFun).toHaveBeenCalled()
      expect(this.testFun2).not.toHaveBeenCalled()
    })
  })

  describe('validation', function () {
    beforeEach(function () {
      this.testFun = function () {}
      spyOn(this, 'testFun')
      this.model = new Model()
    })

    it('should set validation', function () {
      this.model.set('value', 3)
      this.model.on('unvalid:value', this.testFun)
      this.model.setValidation('value', function (nextValue, prevValue) {
        return nextValue < prevValue
      })
      this.model.set('value', 4)

      expect(this.model.get('value')).toBe(3)
      expect(this.testFun).toHaveBeenCalledWith(4)

      this.model.set('value', 2)

      expect(this.model.get('value')).toBe(2)
    })

    it('should remove validation', function () {
      this.model = new Model()
      this.model.set('value', 5)
      this.model.setValidation('value', function (nextValue, prevValue) {
        return nextValue < prevValue
      })
      this.model.set('value', 6)

      expect(this.model.get('value')).toBe(5)

      this.model.removeValidation('value')
      this.model.set('value', 4)

      expect(this.model.get('value')).toBe(4)
    })
  })

  describe('comparator', function () {
    beforeEach(function () {
      this.model = new Model()
      this.testFun = function () {}
      spyOn(this, 'testFun')
    })

    it('should set comparator', function () {
      this.model.set('value', {
        a: 1
      })
      this.model.setComp('value', function (nextValue, prevValue) {
        return nextValue.a === prevValue.a
      })
      this.model.on('change:value', this.testFun)
      this.model.set('value', {
        a: 1
      })

      expect(this.testFun).not.toHaveBeenCalled()

      this.model.set('value', {
        a: 2
      })

      expect(this.testFun).toHaveBeenCalled()
    })
    it('should remove comparator', function () {
      this.model.set('value', {
        a: 1
      })
      this.model.setComp('value', function (nextValue, prevValue) {
        return nextValue.a === prevValue.a
      })
      this.model.set('value', {
        a: 2
      })
      expect(this.testFun).not.toHaveBeenCalled()
      this.model.removeComparator('value')
      this.model.on('change:value', this.testFun)
      this.model.set('value', {
        a: 1
      })

      expect(this.testFun).toHaveBeenCalled()
    })
  })
})
