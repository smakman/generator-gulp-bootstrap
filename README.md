# Gulp Bootstrap 3 Framework

> [Yeoman](http://yeoman.io) generator that scaffolds out a front-end web app using [Gulp](http://gulpjs.com/), [Bower](http://bower.io/) and [Bootstrap 3](http://getbootstrap.com/).

## Features

- CSS & JS minification
- Sass compilation
- EJS templating
- Sprite generation
- Image optimization
- Bower packages
- Built-in preview server

## Getting started

- Install: `npm install -g generator-gulp-bootstrap3`
- Init: `yo gulp-bootstrap3`
- Build: `gulp`
- Run: `gulp watch`

For sprite generation [install node-canvas](https://github.com/Automattic/node-canvas/wiki/Installation---OSX).

## CSS

For each sass file in `src/css` a minified CSS file is generated which gets stored in the build `assets/css` folder. Partials stored in `src/css/partials` can be included with `@import file`. Vendor CSS assets can be stored in `src/vendor` and included with `@import file.css` as well. Bootstrap 3 is imported by default.

## Javascript

For each JS file in `src/js` a minified JS file is generated which gets stored in the build `assets/js` folder. Partials stored in `src/js/partials` can be included with `//= require partials/file.js`. Vendor JS assets can be stored in `src/vendor` and included with `//=require ../vendor/file.js`. Bootstrap 3 is imported by default.

## Templates

For each EJS template in `src/templates` a HTML file is generated and stored in the build folder. Partials stored in `src/templates/partials` can be included with `<% include partials/footer %>`

## Sprites

All images stored in `src/images/sprite/` will be combined in to one sprite, which gets stored in `src/images/sprite.png` and `src/images/sprite-2x.png`. 

**Retina**  
By default retina is turned on, therefore you should only store retina images in the sprite folder. For each retina image a normal version is generated automatically.

**Sass example**
```sass
@import sprite

// cart icon (cart.png in sprite directory)
.cart
  +sprite($cart)
```

All HTML elements which use the sprite should have `class="sprite"`

Check out the [css-sprite documentation](https://www.npmjs.org/package/css-sprite) for other examples.

## Images

All images stored in `src/images` are automatically optimized using [gulp-imagemin](https://www.npmjs.org/package/gulp-imagemin) and saved in the build `assets/images` directory.

## Fonts

All fonts in the source directory or underlying subdirectories get copied to the build `assets/fonts` folder, removing relative paths.

## Live Reload

A live reload server is included as well. Install the [live reload Chrome extension](https://github.com/Automattic/node-canvas/wiki/Installation---OSX) if you don't use the included connect server.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)