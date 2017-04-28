
# Research (Work in Progress)

brought to you as libre software with joy and pride by [Artificial Engineering](http://artificial.engineering).

Support our libre Bot Cloud via BTC [1CamMuvrFU1QAMebPoDsL3JrioVDoxezY2](bitcoin:1CamMuvrFU1QAMebPoDsL3JrioVDoxezY2?amount=0.5&label=lychee.js%20Support).



## Overview

Project Research is a tool that helps you understand the internet more
easily.

It has no support for cookies or logins of any kind. It is a
privacy-respecting and content-agnostic web browser that is made for
off-the-grid scenarios and won't load unnecessary content of websites
that you don't need to read them.

It saves bandwidth - it loads no JS, no Ads, no CSS, no Flash, no
iframes, no analytics redirects. It loads only the type of content
that you have chosen to load - which can be either of text (default),
images or audio/video.

It can archive ANY kind of content to a simple shareable offline
archive folder on your hard drive that you can share via USB and reuse
with other Research installations.

It is peer-to-peer and allows sharing your offline archive of websites
with other local instances, so that you don't waste bandwidth on a
shared internet connection.

It is easily customizable and hackable and embraces the hacking community
rather than offloading it with a gigantic compiling toolchain!

Under the hood it uses [nw.js](https://nwjs.io), [polyfillr](https://polyfillr.github.io)
and [lychee.js](https://lychee.js) and has a zero-unnecessary-dependency
philosophy.


The Offgrid Browser is a project made with [lychee.js](https://lychee.js.org).

It is automatically built and deployed to GitHub using the following
`lycheejs-fertilizer` integration scripts:

- `bin/build.sh` builds the project
- `bin/package.sh` bundles the project into binaries (`nwjs` platform)
- `bin/publish.sh` publishes the binaries to a new GitHub Release.


## Work-in-Progress (aka not working)

These are the features that are currently work-in-progress and are known
to fail right now. If you want to help building these, you are welcome to
submit an Issue or a Pull Request. We could use any help :)

- Fallback Reader Functionality
- Reddit Plugin
- Imgur Plugin
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

