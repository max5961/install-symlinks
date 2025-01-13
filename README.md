_This is an experimental package used to locally install npm packages from your
system using symlinks instead of using **npm link**.  This means you don't need
to re-install updated linked packages.  Read **Warning** before using._

---

# Warning

This package essentially does two things:

1. Installs local packages from your system using npm.
2. Removes and replaces the entry point(s) for your package with a symlink.

If dependency changes made to your linked package after the package has been
linked are breaking to your project, this will silently ignore that and continue
to use the updated package.  If your linked package updates dependencies, you
should run `npx symlink --update` again.

---

## Usage

```sh
npm install --save-dev @mmorrissey5961/install-symlinks
```

```sh
"local-symlinks": {
    "../../foo": ["index.js"]
}
```

#### Install all packages in `local-symlinks`
```sh
npx symlink --update
```

#### Remove a linked package from `local-symlinks`
```sh
npx symlink --remove foo
```

#### Remove all linked pakages in `local-symlinks`
```sh
npx symlink --clean
```


