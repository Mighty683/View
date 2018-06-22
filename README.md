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
  }
  view.render()
  view.showChild('uiElement', childView)
  // HTML: '<div><div class="ui-element"><div></div></div></div>'
```
View should show childView inside '.ui-element'. Remember you can show child views only in rendered views.


You can remove child view by selecting ui element or passing child View object
```js
view.removeChild('uiElement')
```

```js
view.removeChild(childView)
```



### Template 

You can use ```<$variable/>``` syntax to pass data into template.
Data for template comes from View.templateData or from view.model.

```js
let view.model = new Model({
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
  view.template = '<div><div class="ui-element"><$name/> <$getSurname()/> <$proffesion.name/></div></div>'
  view.render()
  // HTML: '<div><div class="ui-element">John Brand Plumber</div></div>'
```

## More

Look test folder for more examples