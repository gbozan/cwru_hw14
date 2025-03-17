// Function to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let metadata = data.metadata; // Get metadata
    let sample_metadata = metadata.filter(row => row.id === parseInt(sample))[0]; // Filter for selected sample
    
    let panel = d3.select("#sample-metadata");
    panel.html(""); // Clear existing metadata
    
    // Append key-value pairs to the panel
    Object.entries(sample_metadata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let samples = data.samples; // Get sample data
    let sample_data = samples.filter(row => row.id === sample)[0]; // Filter for selected sample
    
    let otu_ids = sample_data.otu_ids;
    let otu_labels = sample_data.otu_labels;
    let sample_values = sample_data.sample_values;

    // Bubble Chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: { color: otu_ids, size: sample_values, colorscale: 'Picnic' }
    };
    Plotly.newPlot('bubble', [bubble_trace], {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      height: 600
    });

    // Bar Chart (Top 10 Bacteria Cultures)
    let bar_trace = {
      y: otu_ids.slice(0, 10).map(x => `OTU: ${x}`).reverse(),
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      marker: { color: 'firebrick' },
      orientation: 'h'
    };
    Plotly.newPlot('bar', [bar_trace], {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
      height: 600
    });
  });
}

// Function to initialize the dashboard
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let names = data.names; // Get sample names
    let dropdown = d3.select("#selDataset"); // Select dropdown

    // Populate dropdown with sample names
    names.forEach(name => {
      dropdown.append("option").text(name);
    });

    let first_sample = names[0]; // Use first sample to initialize
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}

// Function to update charts and metadata when selection changes
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
