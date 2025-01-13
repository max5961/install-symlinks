_This is an experimental package used to locally install npm packages from your
system using symlinks instead of using **npm link**.  This means you don't need
to re-install updated linked packages.  Read **Warning** before using._

---

# Warning

This package essentially does two things:

1. Installs local packages from your system using npm.  This is to check for
   dependencies.
2. Removes the package from node_modules and replaces it with a symlink.

If dependency changes made to your linked package after the package has been
linked are breaking to your project, this will silently ignore that and continue
to use the updated package.  If your linked package updates dependencies, you
should run `npx symlink` again.

---

## Usage

```sh
npm install --save-dev @mmorrissey5961/install-symlinks
```

Add a `local-symlinks` array to your `package.json` and then run: `npx symlink`.

Or add and remove symlinks from the command line:

```sh
npx symlink --install ../bar
npx symlink --uninstall ../bar
```


