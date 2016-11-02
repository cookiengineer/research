
# Offgrid Browser (Work in Progress)

brought to you as libre software with joy and pride by [Artificial Engineering](http://artificial.engineering).

Support our libre Bot Cloud via BTC [1CamMuvrFU1QAMebPoDsL3JrioVDoxezY2](bitcoin:1CamMuvrFU1QAMebPoDsL3JrioVDoxezY2?amount=0.5&label=lychee.js%20Support).



## Overview

Did you ever find yourself opening the exact same links on the internet
because you forgot something? Worry no more, the Offgrid Browser is here
to save you bandwidth!

The Offgrid Browser is made for slow internet connections and allows
archiving articles in a local library that can be shared with others
in your local network ([LAN](https://en.wikipedia.org/wiki/Local_area_network))
to reduce further bandwidth usage by others.


The Offgrid Browser is a project made with [lychee.js](https://lychee.js.org).

It is automatically built and deployed to GitHub using the following
`lycheejs-fertilizer` integration scripts:

- `bin/build.sh` builds the project
- `bin/package.sh` bundles the project into binaries (`nwjs` platform)
- `bin/publish.sh` publishes the binaries to a new GitHub Release.


## Features

The Offgrid Browser always downloads *no* JavaScript, *no* CSS, *no* Flash. Its
main focus is back on the content, not on the interaction or the animated stuff
around it:

- Offline-first: Offgrid Browser always uses a local peer-to-peer connected LAN cache *before* requesting content again.
- Privacy-first: Offgrid Browser respects your privacy and has *no cookie or login support* at all.
- Content-first: Offgrid Browser makes all content extractable and readable.
- Archive-first: Offgrid Browser can archive *any* downloaded content.
- Opinion-first: Offgrid Browser lets you decide what to download: `Text`, `Images` and/or `Videos`.

In order to have a smoother internet usage without bloat, the Offgrid Browser
also blocks all known advertisement providers (in case they were requested).


## Work-in-Progress (aka not working)

These are the features that are currently work-in-progress and are known
to fail right now. If you want to help building these, you are welcome to
submit an Issue or a Pull Request. We could use any help :)

- Facebook Plugin
- Gfycat Plugin
- Instagram Plugin
- Medium Plugin


## Installation

This is to be done. There might be some prototypical releases
in the [releases section](https://github.com/Artificial-Engineering/offgrid-browser/releases).


## Scraper Plugins

[app.net.scraper.Reddit](./source/net/scraper/Reddit.js) supports the following URL schemes:

- `/r/<subreddit>`
- `/u/<username>`
- `reddit.com/r/<subreddit>`
- `reddit.com/u/<user>`
- `reddit.com/user/<user>`


## License

The Offgrid Browser is released under [GNU GPL 3](./LICENSE_GPL3.txt) license.

