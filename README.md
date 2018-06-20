# View
Simple event driven View

## Usage


## Features

You can use View as 'Over View' to render others views or to render data inside DOM.

### Model

Data is kept inside Observable Model more info: https://www.npmjs.com/package/observable-model

All data from model is visible inside template

### Render

To render HTML template inside element use like this:
```js
let view = new View({
  el: docEl,
  template: '<div><a>Link</a></div>',
  ui: {
    link: 'a'
  }
})

view.render()
```

### Show Child

You can pass another view to show inside on choosen element

```js
let view = new View({
        rootEl: this.rootEl,
        ui: {
          uiElement: '.ui-element'
        },
        template: '<div><div class="ui-element"></div></div>'
      }),
      childView = new View({
        template: '<div></div>'
      })

      view.render()
      view.showChild('uiElement', this.childView)
```

View should show childView inside '.ui-element'. Remember you can show child views only in rendered views.
