const View = require('../index.js')
const Model = require('observable-model')

describe('View', function () {
  beforeEach(function () {
    this.rootEl = document.createElement('body')
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
          template: '<div></div>'
        })
        this.childView2 = new View({
          template: '<div></div>'
        })
        this.view.render()
        this.view.showChild('uiElement', this.childView)
      })

      it('should render child', function () {
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"><div></div></div><a></a></div>')
      })

      it('should remove child', function () {
        this.view.removeChild('uiElement')
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a></a></div>')
      })

      it('should remove child', function () {
        this.view.showChild('uiElement', this.childView)
        this.view.showChild('link', this.childView2)
        this.view.removeChild(this.childView)
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a><div></div></a></div>')
      })

      it('shouldn\'t render child on re-render child', function () {
        this.view.render()
        expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element"></div><a></a></div>')
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
          name: 'Plumber'
        }
      })
      this.view.template = '<div><div class="ui-element"><$name> <$getSurname()> <$proffesion.name></div></div>'
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
          name: 'Plumber'
        }
      }
      this.view.template = '<div><div class="ui-element"><$name> <$getSurname()> <$proffesion.name></div></div>'
      this.view.render()
      expect(this.rootEl.innerHTML).toBe('<div><div class="ui-element">John Brand Plumber</div></div>')
    })

    it('should pass key if value is missing', function () {
      this.view.templateData = {
        name: 'John',
        proffesion: {
          name: 'Plumber'
        }
      }
      this.view.template = '<div><div class="ui-element"><$name> <$getSurname()> <$proffesion.name></div></div>'
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
  })
})
