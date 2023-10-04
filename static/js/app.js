const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        console.log(data);
        let names = data.names;
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        let name = names[0];
        console.log(name)
        
        barchart(name);
        bubblechart(name);
        demographics(name);
    });
};



// Bar chart function
function barchart(selectedID) {
    d3.json(url).then((data) => {
        console.log(selectedID);
        console.log(data);

        // Filter data and assign to variables         
        let sample_data = data.samples;
        let values = sample_data.filter(result => result.id == selectedID);
        let selecteddata = values[0];
        let otu_ids = selecteddata.otu_ids;
        let otu_labels = selecteddata.otu_labels;
        let sample_values = selecteddata.sample_values;
        
        // Trace for the barchart data
        let trace = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };
        
        // Data trace array
        let dataarray = [trace];

        // Title
        let layout = {
            title: `Top 10 OTUs in Subject ${selectedID}`
        };

        // Render Plot
        Plotly.newPlot("bar", dataarray, layout);
    });
};



// Bubblechart function
function bubblechart(selectedID) {
    d3.json(url).then((data) => {
        
        // Filter data and assign to variables         
         let sample_data = data.samples;
         let values = sample_data.filter(result => result.id == selectedID);
         let selecteddata = values[0];
         let otu_ids = selecteddata.otu_ids;
         let otu_labels = selecteddata.otu_labels;
         let sample_values = selecteddata.sample_values;

        // Trace for bubblechart data
        let trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Jet',
            }
        };
        
        // Data trace array
        let dataarray = [trace];

        // Title
        let layout = {
            title: `OTUs in Subject ${selectedID}`
        };
        
        // Render Plot
        Plotly.newPlot("bubble", dataarray, layout);
    });
};



// Demographics function
function demographics(selectedID) {
    d3.json(url).then((data) => {

        // Filter data and assign to plot
        let sample_metadata = data.metadata;
        let values = sample_metadata.filter(result => result.id == selectedID)
        let selecteddata = values[0];
        
        // Select metadata and append demographics table
        d3.select("#sample-metadata").html("");
        Object.entries(selecteddata).forEach(([key,values]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${values}`);
        });
    });
};



// Function to update plots/data when a new ID number is selected
function optionChanged(selectedID) {
    barchart(selectedID);
    bubblechart(selectedID);
    demographics(selectedID);
}

init();