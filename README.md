_This is an experimental package used to locally install npm packages from your
system instead of using **npm link**.  With this package, nothing is installed
globally.  You create a 'directlinks' object in your package.json, which handles
installing, updating, and removing._

---
This package essentially uninstalls and re-installs packages when you use the
`--update` flag.  It also has the option to symlink entry points, but this
feature is **highly unstable** and will likely cause problems depending on your
package.

## Warning

If you have symlinked entry points, dependency changes to your linked package
will be silently ignored.

---

## Usage
```sh
npm install --save-dev @mmorrissey5961/directlink
```

```sh
"directlinks": {
    "../../foo": []
}
```

To symlink an entry point, add it to the entry points array.
```sh
"directlinks": {
    "../../foo": ["index.js"]
}
```

#### Install all packages in `directlinks`
```sh
npx directlink --update
```

#### Remove a linked package from `directlinks`
```sh
npx directlink --remove foo
```

#### Remove all linked pakages in `directlinks`
```sh
npx directlink --clean
```


