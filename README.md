
[![pipeline status](https://git.migum.eu/migum/View/badges/master/pipeline.svg)](https://git.migum.eu/migum/View/commits/master)
[![coverage report](https://git.migum.eu/migum/View/badges/master/coverage.svg)](https://git.migum.eu/migum/View/commits/master)

# View
Simple event driven View

## Usage

```npm install event-driven-view```

## Features

View is basic 'brick' of framework. Use it to show and control content on page.

### Show
To render HTML template inside element use show:
```js
let view = new View({
  rootEl: docEl,
  template: '<div><a>Hello World</a></div>'
})

view.show()
```

View options:
- rootEl: element to which view will be attached
- element: view can be wrapped inside element, new element will be rootEl after render
- classList: list of classes which will be added to root element
- template: HTML template
- model: instance of observable-model
- templateData: data passed for template parsing
- ui: elements for controlling view and rendering childviews every view after render has 'rootEl' ui element
- uiEvents: array of UI events

### Show Child View

View can show another View inside itself or in choosen element.

```js
let view = new View({
    rootEl: this.rootEl,
    ui: {
      uiElement: '.ui-element'
    },
    template: '<div><div class="ui-element"></div></div>'
  }),
  childView = new View({
    template: '<a></a>'
  })
  view.render()
  view.show('uiElement', childView)
  // HTML: '<div><div class="ui-element"><a></a></div></div>'
```

Ui elements are accesible after render.

```js
let view = new View({
    rootEl: this.rootEl
  }),
  childView = new View({
    template: '<a></a>'
  })
  view.render()
  view.show(childView)
  // HTML: '<a></a>'
  view.show(childView, 'p')
  // HTML: '<p><a></a></p>'
```
View can show another view inside of view instead of using template. You can wrap child view inside of element(optional)



View can render collection of elements:
```js
let view = new View({
    rootEl: this.rootEl,
    ui: {
      uiElement: '.ui-element'
    },
    template: '<div><div class="ui-element"></div></div>'
  }),
  childViewArray = [new View({
    template: '<a></a>'
  }), new View({
    template: '<p></p>'
  })]
  view.render()
  view.show('uiElement', childViewArray)
  // HTML: '<div><div class="ui-element"><a></a><p></p></div></div>'
```

To prevent rendering multiple views with the same rootEl use element argument.
Child Views will be wrapped into new elements.
If child view has own element, show will use childView.element instead of element argument.
```js
let view = new View({
    rootEl: this.rootEl,
    ui: {
      uiElement: '.ui-element'
    },
    template: '<div><div class="ui-element"></div></div>'
  }),
  childViewArray = [new View({
    template: ''
  }), new View({
    template: ''
  })]
  view.render()
  view.show('uiElement', childViewArray, 'p')
  // HTML: '<div><div class="ui-element"><p></p><p></p></div></div>'
```


View can remove child view by selecting ui element or passing child View object.
If ui element has collection of views all will be removed.
```js
view.removeChild('uiElement')
```

```js
view.removeChild(childView)
```
### UI Events

View can attach event listeners to UI elements

```js
let view = new View({
    rootEl: this.rootEl,
    ui: {
      link: '.link',
      linkSecond: '.link_second'
    }
    uiEvents: {
      'click @link': 'onLinkClick',
      'click @linkSecond false': function () {
         console.log('click')
      }
    },
    onLinkClick: function () {
      return 'text'
    }
  })
  /*
    Eq to:
     view.getUI('link').addEventListener('click', view.onLinkClick)
     view.getUI('linkSecond').addEventListener('click, function ..., false)
  */
```

### Template 

View can use ```<$ variable />``` syntax to pass data into template.
Data for template comes from View.templateData or from view.model.

Data is kept inside Model more info: ```src/Model/README.md```

All data from model is visible inside template.

```js
let view.model = new Model({
    getSurname: function () {
      let variable = {
        el: 'Brand'
      }
      return variable['el']
    },
    proffesion: {
      name: 'Plumber'
    }
  }),
  view.templateData = {
    name: 'John',
    showName: true
  }
  view.template = '<div><div class="ui-element"><$ name /> <$ getSurname() /> <$ proffesion.name /></div></div>'
  view.render()
  // HTML: '<div><div class="ui-element">John Brand Plumber</div></div>'
```

### UI Methods

UI component from getUI method extends document Element by new methods.
Available UI methods:
```js
let ui = view.getUI('selector')

ui.removeClass('className')
ui.addClass('className')
ui.toogleClass('className')
```

Every rendered view has 'rootEl' UI!

## More

Look test folder for more examples
