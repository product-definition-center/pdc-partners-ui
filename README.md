## Development and building

To run the development server, run:

    $ npm install
    $ npm run start

This will start a server on port 3000. Changes in most files will be picked up
automatically and you don't even need to reload the browser.

Building the static version is done with:

    $ npm run build

This command will create a `bundle.js` file in `dist/` directory. This needs to
be served from `static/` directory. Use `index.html` as an entry point. When
deployed, make sure the fonts are available.

A file named `config.json` should be available in the `static/` folder. It
should contain an object with key `baseURL` pointing to the API root of PDC
server. The URL must include trailing slash.


## Technical background

The application is built using [React] for rendering the views and [Redux] for
managing the application state. Communication with the PDC server is done using
[isomorphic-fetch] package (although only the browser part is actually used).

[React]: https://facebook.github.io/react/
[Redux]: http://rackt.org/redux/
[isomorphic-fetch]: https://github.com/matthew-andrews/isomorphic-fetch

The server url is currently hardcoded in `actions.js` file as a top-level
constant.


## Architecture overview

The app itself is modeled as a state machine, where each state corresponds to a
particular view. The transitions are initiated by user clicking on buttons. See
the top of `reducers.js` for more details.

The the app is loaded, it starts to download the data about partners and
releases. This data is stored and never refreshed (except for changes made by
the user).

All other interactions with the server are a result of some user action.
