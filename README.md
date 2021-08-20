
# Research (Prototype)

This prototype is now out-of-date, archived and will not be maintained
anymore. The learnings of this project have evolved into the peer-to-peer
[Tholian Stealth Browser](https://github.com/tholian-network/stealth).




## Overview

Project Research is a tool that helps you understand the internet more
easily and comes with an easy natural language interface. It is not
a stupid assistant, but more of an "internet buddy" to ease up your
web browsing experience and support you as far as possible.

![dialog](./guides/screenshot/dialog.png)


## Features

- does not load Cookies, JS or CSS
- does not load Flash, Advertisements, iFrames or trackable resources
- totally anonymous, saves much bandwidth and re-uses offline cache
- sweet NLP interface that eases up indexing, crawling and scraping tasks
- reproducible history, allowing forward/backward modifications in time
- cache uses markdown to represent results (and saves storage space)

You have full control over what content is requested. There's even a
`Tethering Mode` that will allow you to _only_ load text content and
will not load images or videos until you say so.

Project Research also saves you bandwidth. By default, it will prefer
the local remembered content and not request anything until you say so.
You have full control about what content is loaded.

It can archive ANY kind of content to a simple shareable offline
archive folder on your hard drive that you can share via USB and reuse
with other Project Research installations on other computers.

It is peer-to-peer and allows sharing your offline archive of websites
with other local instances, so that you don't waste bandwidth on a
shared internet connection.

Under the hood it uses [nw.js](https://nwjs.io) and [lychee.js](https://lychee.js)
and has a zero-unnecessary-dependency philosophy.


## Installation

Research is a project made with [lychee.js](https://lychee.js.org).

It is automatically built and deployed to GitHub using the following
`lycheejs-fertilizer` integration scripts:

- `bin/build.sh` builds the project
- `bin/package.sh` bundles the project into binaries (`nwjs` platform)
- `bin/publish.sh` publishes the binaries to a new GitHub Release.

----------

## Work-in-Progress (aka not working)

These are the features that are currently work-in-progress and are known
to fail right now. If you want to help building these, you are welcome to
submit an Issue or a Pull Request. We could use any help :)

- Fallback Reader Functionality
- Imgur Plugin
- Facebook Plugin
- Gfycat Plugin
- Instagram Plugin
- Medium Plugin
- DuckDuckGo Plugin


----------


## Usage / How To Test (for now)

Builds are released once we get into public beta and have above
plugins implemented. For now, you manually have to download the
nw.js SDK and execute it in Project Research's root folder:

- Have a UNIX machine (Linux, OSX, BSD, whatever)
- Install nw.js SDK on your machine
- Do this in your Terminal:

```bash
git clone https://github.com/cookiengineer/research.git;

cd ./research;
nw .;
```


## Schema

- `@<person>` for person related search
- `#<topic>` for topic related search
- `~<location>` for location related search
- `<input>` for generic search

## Incremental Schema

- `sort by relevance`
- `sort by votes` or `sort by likes`
- `sort by time` or `sort by date`


## License

Project Research is released under [GNU GPL 3](./LICENSE_GPL3.txt) license.

