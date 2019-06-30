# simple-data-grapher
Turns CSVs into graphs in a few simple steps; embeds onto other websites!

## Quick Setup :

### Installation Instructions:
1. Clone this repository to your local environment.
    `git clone https://github.com/publiclab/simple-data-grapher`
2. Run `npm install` to install all the necessary packages required.
3. Open `examples/index.html` in your browser to look at the preview of the library.

### Instructions for a developer:
1. Make the changes you are working on in respective /src files.
2. After doing or while doing the changes run `npm run build` for making the changes in the `dist/`.
3. Run 'npm run test' to run the tests.
4. Test your changes on a browser by opening `examples/index.html`.
5. For finding linting issues run `npm run lint`

We are using `babel` to transpile code into es5 and `browserify` to `require` different files and `watch` to watch the changes and build the changes.
For testing we are using `mocha`.
