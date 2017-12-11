
# React Front End for https://github.com/kudou-reira/xdcc2

still very rough, working on developing out using atarashii api for currently airing series as well as connections to irc via node.

created with electron, download prototype here and start MyApp https://drive.google.com/file/d/1wE1mkkX5ZUEQH5B48TZnvN3n2ZufeU8i/view?usp=sharing

electron-react-redux-boilerplate fork tailored to personal preference

# electron-react-redux-boilerplate

A minimal boilerplate to get started with [Electron](http://electron.atom.io/), [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/).

Including:

* [React Router](https://reacttraining.com/react-router/)
* [Redux Thunk](https://github.com/gaearon/redux-thunk/)
* [Redux Actions](https://github.com/acdlite/redux-actions/)
* [Redux Local Storage](https://github.com/elgerlambert/redux-localstorage/)
* [Electron Packager](https://github.com/electron-userland/electron-packager)
* [Electron DevTools Installer](https://github.com/MarshallOfSound/electron-devtools-installer)
* [Electron Mocha](https://github.com/jprichardson/electron-mocha)
* [Browsersync](https://browsersync.io/)

## Quick start

Clone the repository
```bash
git clone --depth=1 git@github.com:jschr/electron-react-redux-boilerplate.git
```

Install dependencies
```bash
cd electron-react-redux-boilerplate
npm install
```

Development
```bash
npm run develop
```

## DevTools

Toggle DevTools:

* OSX: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
* Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
* Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

## Packaging

Modify [electron-builder.yml](./electron-builder.yml) to edit package info.

For a full list of options see: https://github.com/electron-userland/electron-builder/wiki/Options.

Create a package for OSX, Windows and Linux
```
npm run pack
```

Or target a specific platform
```
npm run pack:mac
npm run pack:win
npm run pack:linux
```

## Tests

```
npm run test
```

## Maintainers

- [@jschr](https://github.com/jschr)
- [@pronebird](https://github.com/pronebird)
