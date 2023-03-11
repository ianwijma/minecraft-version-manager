# minecraft-version-manager CLI

A CLI for minecraft-version-manager.

## Customizing your CLI

Check out the documentation at https://github.com/infinitered/gluegun/tree/master/docs.

## Publishing to NPM

To package your CLI up for NPM, do this:

```shell
$ npm login
$ npm whoami
$ npm test

$ npm run build

$ npm publish
```

# License

MIT - see LICENSE

# Authentication helpI'm using the GDLauncher as an example:
- Trigger OAuth: https://github.com/gorilla-devs/GDLauncher/blob/17df6d8fc9c1505a6c216bac7321f25225174324/src/common/reducers/actions.js#L703
- Handle Oauth: https://github.com/gorilla-devs/GDLauncher/blob/7fd15c7d75de8af1416c53c6df3acc69fc3b0fdb/public/electron.js#L429
