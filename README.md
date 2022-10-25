
# SilverBullet plug for real-time collaboration

WIP

## Build
To build this plug, make sure you have `plugos-bundle` installed. If not, be sure to have [Deno](https://deno.land) installed first, then run:

```shell
deno install -f -A --unstable --importmap https://deno.land/x/silverbullet/import_map.json https://deno.land/x/silverbullet/plugos/bin/plugos-bundle.ts
```

After this, build the plug with

```shell
deno task build
```

Or to watch for changes and rebuild automatically

```shell
deno task watch
```

Then, load the locally built plug, add it to your `PLUGS` note with an absolute path, for instance:

```
- file:/Users/you/path/to/collab.plug.json
```

And run the `Plugs: Update` command in SilverBullet.
## Installation
If you would like to install this plug straight from Github, make sure you have the `.json` file committed to the repo and simply add

```
- github:user/plugname/plugname.plug.json
```

to your `PLUGS` file, run `Plugs: Update` command and off you go!

## What's with all that Lone Ranger quotes

Don't you know that the [Lone Ranger used silver bullets to solve all the problems](https://en.wikipedia.org/wiki/Silver_bullet#Lone_Ranger)?
