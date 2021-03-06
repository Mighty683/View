const View = require('../index.js').View
const Model = require('../index.js').Model

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

      this.view.show()

      expect(this.rootEl.innerHTML).toBe('<div></div>')
    })

    describe('child views', function () {
      it('should show empty element', function () {
        this.view = new View({
          rootEl: this.rootEl
        })
        this.view2 = new View({
          element: 'p'
        })

        this.view.show(this.view2)

        expect(this.rootEl.innerHTML).toBe('<p></p>')
      })

      it('should show view on rootEl', function () {
        this.view = new View({
          rootEl: this.rootEl
        })
        this.childView = new View({
          template: '<a></a>',
          element: 'p'
        })
        this.view.show(this.childView)

        expect(this.rootEl.innerHTML).toBe('<p><a></a></p>')
      })

      it('should hide elements', function () {
        this.view = new View({
          rootEl: this.rootEl,
          template: '<div></div>'
        })
        this.childView = new View({
          template: '<a></a>'
        })
        this.view.show(this.childView)
        this.view.hide()

        expect(this.rootEl.innerHTML).toBe('')
      })

      it('should hide child view from root El', function () {
        this.view = new View({
          rootEl: this.rootEl,
          template: '<div></div>'
        })
        this.childView = new View({
          template: '<a></a>'
        })
        this.view.show(this.childView)
        this.view.removeChild(this.childView)

        expect(this.rootEl.innerHTML).toBe('')
      })

      it('should hide child view from root El', function () {
        this.view = new View({
          rootEl: this.rootEl
        })
        this.childView = new View({
          template: '<a></a>'
        })
        this.view.show(this.childView)
        this.view.removeChild('rootEl')

        expect(this.rootEl.innerHTML).toBe('')
      })

      it('should show view on rootEl', function () {
        this.view = new View({
          rootEl: this.rootEl
        })
        this.childView = new View({
          template: '<a></a>'
        })
        this.view.show(this.childView, 'p')

        expect(this.rootEl.innerHTML).toBe('<p><a></a></p>')
      })

      it('should show only template after showing view view on rootEl', function () {
        this.view = new View({
          rootEl: this.rootEl,
          template: '<div></div>'
        })
        this.childView = new View({
          template: '<a></a>'
        })
        this.view.show(this.childView)
        this.view.show()

        expect(this.rootEl.innerHTML).toBe('<div></div>')
      })
    })

    describe('wrapping', function () {
      it('should wrap template', function () {
        this.view = new View({
          rootEl: this.rootEl,
          template: '<div></div>',
          element: 'p'
        })

        this.view.show()

        expect(this.rootEl.innerHTML).toBe('<p><div></div></p>')
      })

      it('should wrap template once', function () {
        this.view = new View({
          rootEl: this.rootEl,
          template: '<div></div>',
          element: 'p'
        })

        this.view.show()
        this.view.show()

        expect(this.rootEl.innerHTML).toBe('<p><div></div></p>')
      })
    })

    describe('adding class', function () {
      it('should add classes to el', function () {
        this.view = new View({
          rootEl: this.rootEl,
          template: '<div></div>',
          classList: ['class', 'class1']
        })

        this.view.show()

        expect(this.rootEl.classList.contains('class')).toBeTruthy()
        expect(this.rootEl.classList.contains('class1')).toBeTruthy()
      })

      it('should wrap template and add class', function () {
        this.view = new View({
          rootEl: this.rootEl,
          template: '<div></div>',
          element: 'p',
          classList: ['class']
        })

        this.view.show()

        expect(this.rootEl.innerHTML).toBe('<p class="class"><div></div></p>')
      })
    })

    it('should emit render event', function () {
      this.testFun = function (view) {
      }
      spyOn(this, 'testFun')
      this.view = new View({
        rootEl: this.rootEl
      })
      this.view.on('render', this.testFun)

      this.view.show()

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

      this.view.show()

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
        this.view.show()
      })

      it('should show child', function () {
        this.view.show('uiElement', this.childView)
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"><a></a></div><a></a></div>')
      })

      it('should show childsViews', function () {
        this.view.show('uiElement', this.childView)
        this.view.show('link', this.childView2)
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"><a></a></div><a><b></b></a></div>')
      })

      it('should remove child', function () {
        this.view.removeChild('uiElement')
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a></a></div>')
      })

      it('should remove proper child', function () {
        this.view.show('uiElement', this.childView)
        this.view.show('link', this.childView2)
        this.view.removeChild(this.childView)
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a><b></b></a></div>')
      })

      it('should hide only proper child', function () {
        this.view.show('uiElement', this.childView)
        this.view.show('link', this.childView2)
        this.childView.hide()
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a><b></b></a></div>')
      })

      it('shouldn\'t show child on re-show child', function () {
        this.view.show()
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
        this.view.show()
      })

      it('should show multiple childViews', function () {
        this.view.show('uiElement', this.childArray)
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"><a></a><b></b></div></div>')
      })

      it('should show multiple wraped childViews', function () {
        this.view.show('uiElement', this.childArray, 'p')
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"><p><a></a></p><p><b></b></p></div></div>')
      })

      it('should remove all childViews', function () {
        this.view.show('uiElement', this.childArray)
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
      this.view.show()
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element">&lt;div&gt;John&lt;/div&gt;</div></div>')
    })

    it('should not escape template', function () {
      this.view.model = new Model({
        name: '<div>John</div>'
      })
      this.view.template = '<div><div class="ui-element"><$ name /></div></div>'
      this.view.show()
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
      this.view.show()
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
      this.view.show()
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
      this.view.show()
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

      this.view.show()
      this.view.show('uiElement', this.childView)
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

      this.view.show()
      this.view.show('uiElement', this.childView)
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
      this.view.show()
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
      this.view.getUI('uiElement').toogleClass('class1')
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a></a></div>')
      this.view.getUI('uiElement').toogleClass('class1')
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element class1"></div><a></a></div>')
    })
  })

  describe('utility functions', function () {
    beforeEach(function () {
      this.testFun = function () {}
      spyOn(this, 'testFun')
    })
    describe('event listeners', function () {
      it('should add event listener from string', function () {
        this.view = new View({
          rootEl: this.rootEl,
          template: '<a></a><a class="js-link"></a>',
          ui: {
            link: 'a',
            link2: '.js-link'
          },
          uiEvents: {
            'click @link': 'onLinkClick'
          },
          onLinkClick: function () {
            return 'text'
          }
        })
        spyOn(this.view, 'onLinkClick')

        this.view.show()
        this.view.getUI('link').click()

        expect(this.view.onLinkClick).toHaveBeenCalled()
      })

      it('should add event listener from function', function () {
        this.onLinkClick = function () {
          console.error('kurwa')
          return 'text'
        }
        spyOn(this, 'onLinkClick')
        this.view = new View({
          rootEl: this.rootEl,
          template: '<a></a><a class="js-link"></a>',
          ui: {
            link: 'a',
            link2: '.js-link'
          },
          uiEvents: {
            'click @link': this.onLinkClick
          }
        })

        this.view.show()
        this.view.getUI('link').click()

        expect(this.onLinkClick).toHaveBeenCalled()
      })

      it('should add event listener add useCapture', function () {
        this.onLinkClick = function () {
          return 'text'
        }
        spyOn(this, 'onLinkClick')
        this.view = new View({
          rootEl: this.rootEl,
          template: '<a></a><a class="js-link"></a>',
          ui: {
            link: 'a',
            link2: '.js-link'
          },
          uiEvents: {
            'click @link true': this.onLinkClick
          }
        })
        spyOn(Element.prototype, 'addEventListener')

        this.view.show()

        expect(this.view.getUI('link').addEventListener).toHaveBeenCalledWith('click', this.onLinkClick, 'true')
      })
    })
  })
})
