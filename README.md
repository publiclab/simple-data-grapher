# Simple-Data-Grapher
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
3. Run `npm run test` to run the tests.
4. Test your changes on a browser by opening `examples/index.html`.
5. For finding linting issues run `npm run lint`

We are using `babel` to transpile code into es5 and `browserify` to `require` different files and `watch` to watch the changes and build the changes.
For testing we are using `mocha`.
### Flow: Basic Flow of the Library

![](https://lh3.googleusercontent.com/EBhm7ICy8xLrZ0LQfYiRNXlc9nt7QHWdUN1rBk8GQVz-9KkZwcEDqjrH_BY62NCs78hGUDpH3MyFknaafds8QCgLR2PW7Li6EPmX_bkhIxnQOeeKdiqEGD6T7H5yKlpKhyqihF6I)

- **View.js:** First reads the input files through the event listeners and sends the file to Csvparser.js, then once the required information is received, it displays a sample of the data. It then takes the selected data by the user, through the `afterSampleData()` method, and goes to the plotting library, and displays the graph.

- **Csvparser.js:** Receives the file and it's format type and:

    - Parses the CSV
    - Determines headers
    - Determines a matrix for the complete data
    - Extracts sample data to be displayed to the user for selection
    - Creates a transpose of the data

- **PlotlyjsPlotter.js (default) or ChartjsPlotter.js:** Assembles the received data according to its format and plots the graph on the canvas element.

### Peripheral Features in Stand-alone
    
- **Add Graph:** It is checked at `showSampleDataXandY()`, where the number of currently plotted graphs is incremented and it is sent as a flag, where the newly plotted graph has to be appended in the chart area, and not clear the canvas.

- **Create Spreadsheet:** Uses the transpose created by Csvparser.js and creates a (excel or xlsx) spreadsheet using `SheetJS` and downloads it.

- **CODAP Export:** CODAP is used here to view the CSV data in a proper tabular form. From there, the user can view a summary of their data, view a more readable form of it and use other tools that CODAP's Plugin API offers. The user can also export their data as a CSV directly to their Google Drive.

### Plotlyjs v/s Chartjs

I created an `adapter function` which can easily switch between the two charting libraries, as one can be advantageous over the other in different situations.

- Plotlyjs is more extensively used than Chartjs
- Plotlyjs provides options like:
    - Zooming
    - Panning
    - Autoscaling
    - Downloading the graph as an image
    - Box and Lasso select
    - Edit graph in Plotlyjs editor
- Chartjs:
    - Better comparison
    - Better color scheme and design
    - More informative tooltips

### Flow in plots2

The basic flow remains the same as in the standalone library.

#### Features introduced on integration

- **Save the data:** The user can save their uploaded CSV and use it later for plotting.

- **Using previously uploaded data for plotting:** Users can use their previously uploaded files for plotting in simple-data-grapher.

- Associate a file title and description with the uploaded data.

- **Per-User Data Page:** Lists down all the files a user has saved, their title & description. The user can delete as well as download the files.

### Publish as a Research Note

The user can publish their plotted charts as a Research Note on Public Lab and discuss their findings.

#### Flow 

![](https://lh5.googleusercontent.com/4LJ1qzCD1WFMSmvLTR4FBaB0pF5bKRLo2MQUiP6e_1iipt7gWoxZMfjiNzc2ZRMydebksz4E4w1PUmhR90f3b0zJSHLNbnfXF5X-ScZZL-q50CLITgBEi9HUqu7aqxTXR0e38be8)

