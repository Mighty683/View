const View = require('../index.js')
const Model = require('observable-model')

describe('View', function () {
  beforeEach(function () {
    this.rootEl = document.createElement('body')
    this.rootEl.innerHTML = '<a></a>'
  })

  it('should be defined', function () {
    expect(View).toBeDefined()
  })

  describe('constructor', function () {
    it('should have dom element attached', function () {
      this.view = new View({
        rootEl: this.rootEl
      })

      expect(this.view.rootEl).toEqual(this.rootEl)
    })
  })

  describe('rendering', function () {
    it('should show template', function () {
      this.view = new View({
        rootEl: this.rootEl,
        template: '<div></div>'
      })

      this.view.render()

      expect(this.rootEl.innerHTML).toBe('<div></div>')
    })

    it('should emit render event', function () {
      this.testFun = function (view) {
      }
      spyOn(this, 'testFun')
      this.view = new View({
        rootEl: this.rootEl
      })
      this.view.on('render', this.testFun)

      this.view.render()

      expect(this.testFun).toHaveBeenCalledWith(this.view)
    })

    it('should call onRender', function () {
      this.testFun = function () {
      }
      spyOn(this, 'testFun')
      this.view = new View({
        rootEl: this.rootEl
      })
      this.view.onRender = this.testFun

      this.view.render()

      expect(this.testFun).toHaveBeenCalledWith(this.view)
    })

    describe('child views', function () {
      beforeEach(function () {
        this.view = new View({
          rootEl: this.rootEl,
          ui: {
            uiElement: '.ui-element',
            link: 'a'
          },
          template: '<div><div class="ui-element"></div><a></a></div>'
        })
        this.childView = new View({
          template: '<a></a>'
        })
        this.childView2 = new View({
          template: '<b></b>'
        })
        this.view.render()
      })

      it('should render child', function () {
        this.view.showChild('uiElement', this.childView)
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"><a></a></div><a></a></div>')
      })

      it('should render childsViews', function () {
        this.view.showChild('uiElement', this.childView)
        this.view.showChild('link', this.childView2)
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"><a></a></div><a><b></b></a></div>')
      })

      it('should remove child', function () {
        this.view.removeChild('uiElement')
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a></a></div>')
      })

      it('should remove proper child', function () {
        this.view.showChild('uiElement', this.childView)
        this.view.showChild('link', this.childView2)
        this.view.removeChild(this.childView)
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a><b></b></a></div>')
      })

      it('should hide only proper child', function () {
        this.view.showChild('uiElement', this.childView)
        this.view.showChild('link', this.childView2)
        this.childView.hide()
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a><b></b></a></div>')
      })

      it('shouldn\'t render child on re-render child', function () {
        this.view.render()
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a></a></div>')
      })
    })

    describe('views collections', function () {
      beforeEach(function () {
        this.view = new View({
          rootEl: this.rootEl,
          ui: {
            uiElement: '.ui-element'
          },
          template: '<div><div class="ui-element"></div></div>'
        })
        this.childView = new View({
          template: '<a></a>'
        })
        this.childView2 = new View({
          template: '<b></b>'
        })
        this.childArray = [this.childView, this.childView2]
        this.view.render()
      })

      it('should render multiple childViews', function () {
        this.view.showCollection('uiElement', this.childArray)
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"><a></a><b></b></div></div>')
      })

      it('should remove all childViews', function () {
        this.view.showCollection('uiElement', this.childArray)
        this.view.removeChild('uiElement')
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div></div>')
      })
    })
  })

  describe('template evaluating', function () {
    beforeEach(function () {
      this.view = new View({
        rootEl: this.rootEl,
        ui: {
          uiElement: '.ui-element'
        }
      })
    })

    it('should escape template', function () {
      this.view.model = new Model({
        name: '<div>John</div>'
      })
      this.view.template = '<div><div class="ui-element"><$_ name /></div></div>'
      this.view.render()
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element">&lt;div&gt;John&lt;/div&gt;</div></div>')
    })

    it('should not escape template', function () {
      this.view.model = new Model({
        name: '<div>John</div>'
      })
      this.view.template = '<div><div class="ui-element"><$ name /></div></div>'
      this.view.render()
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"><div>John</div></div></div>')
    })

    it('should pass model data to template', function () {
      this.view.model = new Model({
        name: 'John',
        getSurname: function () {
          let variable = {
            el: 'Brand'
          }
          return variable['el']
        },
        proffesion: {
          proffName: 'Plumber'
        }
      })
      this.view.template = '<div><div class="ui-element"><$name/> <$getSurname()/> <$proffesion.proffName/></div></div>'
      this.view.render()
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element">John Brand Plumber</div></div>')
    })

    it('should pass template data to template', function () {
      this.view.templateData = {
        name: 'John',
        getSurname: function () {
          let variable = {
            el: 'Brand'
          }
          return variable['el']
        },
        proffesion: {
          proffName: 'Plumber'
        }
      }
      this.view.template = '<div><div class="ui-element"><$name/> <$getSurname()/> <$proffesion.proffName/></div></div>'
      this.view.render()
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element">John Brand Plumber</div></div>')
    })

    it('should pass key if value is missing', function () {
      this.view.templateData = {
        name: 'John',
        proffesion: {
          proffName: 'Plumber'
        }
      }
      this.view.template = '<div><div class="ui-element"><$name/> <$getSurname()/> <$proffesion.proffName/></div></div>'
      this.view.render()
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element">John getSurname() Plumber</div></div>')
    })
  })

  describe('hide', function () {
    beforeEach(function () {
      this.view = new View({
        rootEl: this.rootEl
      })
    })

    it('should emit hide event on hide', function () {
      spyOn(this.view, 'emit')
      this.view.hide()
      expect(this.view.emit).toHaveBeenCalledWith('hide', this.view)
    })

    it('should clear root element on hide', function () {
      this.view.hide()
      expect(this.rootEl.innerHTML).toBe('')
    })

    it('should remove node content from DOM on hide', function () {
      this.view = new View({
        rootEl: this.rootEl,
        ui: {
          uiElement: '.ui-element'
        },
        template: '<div><div class="ui-element"></div></div>'
      })
      this.childView = new View({
        template: '<div></div>'
      })

      this.view.render()
      this.view.showChild('uiElement', this.childView)
      this.childView.hide()

      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div></div>')
    })

    it('should hide child views', function () {
      this.view = new View({
        rootEl: this.rootEl,
        ui: {
          uiElement: '.ui-element'
        },
        template: '<div><div class="ui-element"></div></div>'
      })
      this.childView = new View({
        template: '<div></div>'
      })

      this.view.render()
      this.view.showChild('uiElement', this.childView)
      this.view.hide()

      expect(this.rootEl.innerHTML).toBe('')
      expect(this.childView.rootEl.firstChild).toBe(null)
    })
  })

  describe('UI methods', function () {
    beforeEach(function () {
      this.view = new View({
        rootEl: this.rootEl,
        ui: {
          uiElement: '.ui-element',
          link: 'a'
        },
        template: '<div><div class="ui-element class1"></div><a></a></div>'
      })
      this.view.render()
    })

    it('should remove class from UI ', function () {
      this.view.getUI('uiElement').removeClass('class1')
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a></a></div>')
    })

    it('should add class to UI ', function () {
      this.view.getUI('uiElement').addClass('class2')
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element class1 class2"></div><a></a></div>')
    })

    it('shouldn\'t add class to UI ', function () {
      this.view.getUI('uiElement').addClass('class1')
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element class1"></div><a></a></div>')
    })

    it('should toggle class on UI ', function () {
      this.view.getUI('uiElement').removeClass('class1')
      this.view.getUI('link').toogleClass('class1')
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a class="class1"></a></div>')
    })
  })
})
