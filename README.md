# CCEditor

This is a simple editor app for college course project.

## Protocol Implementation

Protocol `cceditor` has been implemented. It supports the following operations:

- `cceditor://static` - refers to the root directory of the app
- `cceditor://bundle` - refers to the `app.asar` file of the app

Easily, you can visit `cceditor://bundle/web/index.html` to view the Vue collections packaged in `app.asar`

## Usage

Install necessary dependencies globally

```shell
npm i -g electron electron-builder
```

Install dependencies

```shell
npm i
```

Type `npm run <command>` to use predefined scripts. Commands are as follows:

- `vue:serve` - serves the Vue app independently (without Electron) under **development** mode
- `vue:build` - builds the Vue app independently (without Electron) under **development** mode (output `web-dist`)
- `vue:lint` - lints the Vue app
- `electron:build-vue` - builds the Vue app for electron under **production** mode (output `web`)
- `electron:make` - builds the Electron app based on output of Vue (`electron:build-vue` prerun needed)
- `build` - builds the Electron app with Vue
- `test` - tests the Electron app with Vue (Vue hot server)

If you just want to build the app from source, run

```shell
npm run build
```
