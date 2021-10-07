/** 
*@DOWNLOADJSON getting the first values
*/

var sampleDataValues
var sampleDataOtuId
var sampleDataOtuLabels 
var sampleMetaData

// top 10 OTUs 
var sampleTop10DataValues 
var sampleTop10DataOtuId 
var	sampleTop10DataOtuLabels 

var sampleData
var idNames
var data
d3.json("samples.json").then(newData => {
    //console.log(newData);
    data = newData;
    console.log(data);
    idNames = data.names;
    console.log(idNames);
    idNames.forEach((idName) => {
        d3.select("#selDataset").append("option").text(idName);
    }); 
    init()
});

function init () {
    sampleData = data.samples.filter(sample => sample.id == "940")[0]; 
        
        console.log(sampleData);

		sampleDataValues = sampleData.sample_values;
		sampleDataOtuId = sampleData.otu_ids;
		sampleDataOtuLabels = sampleData.otu_labels;

	// top 10 OTUs 
		sampleTop10DataValues = sampleData.sample_values.slice(0, 10).reverse();
		sampleTop10DataOtuId = sampleData.otu_ids.slice(0, 10).reverse();
		sampleTop10DataOtuLabels = sampleData.otu_labels.slice(0, 10).reverse();

		console.log(sampleTop10DataValues);
		console.log(sampleTop10DataOtuId);
		console.log(sampleTop10DataOtuLabels);

     /** 
      *@BARCHART
      */
        var traceBar = {
            type: "bar",
            y: sampleTop10DataOtuId.map(id => "otu" + id),
            x: sampleTop10DataValues,
            text: sampleTop10DataOtuLabels,
            orientation: 'h'
        };

        var traceData1 = [traceBar];

        var layoutBar = {
            title: "Top 10 OTUs",
            yaxis: { title: "OTU Label" },
            xaxis: { title: "Values"}
        };
    
        Plotly.newPlot("bar", traceData1, layoutBar);

/** 
*@BUBBLECHART
*/
var traceBubble = {
    x: sampleDataOtuId,
    y: sampleDataValues,
    mode: 'markers',
    text: sampleDataOtuLabels,
    marker: {
      color: sampleDataOtuId,
      size: sampleDataValues,
    },
    type: 'scatter'
  };

  var traceData2 = [traceBubble];

  var layoutBubble = {
    title: "OTU ID",
    showlegend: false,
    height: 500,
    width: 1200
  };

  Plotly.newPlot("bubble", traceData2, layoutBubble);

/** 
*@SAMPLEMETADATA
*/

sampleMetaData = data.metadata.filter(sample => sample.id === 940)[0]; 
        
console.log(sampleMetaData);

Object.entries(sampleMetaData).forEach(
    ([key, value]) => d3.select("#sample-metadata").append("h5").text(key + ": " + value)

)}

/**
 * @NEWSORTS
 */

//  update with DOM changes
d3.selectAll("#selDataset").on("change", updatePlot);

function updatePlot() {

    var inputElement = d3.select("#selDataset");

         var inputValue = inputElement.property("value");
         console.log(inputValue);
     
         sampleData = data.samples.filter(sample => sample.id === inputValue)[0];
         console.log(sampleData);

        sampleDataValues = sampleData.sample_values;
		sampleDataOtuId = sampleData.otu_ids;
		sampleDataOtuLabels = sampleData.otu_labels;

		// top 10 OTUs 
		sampleTop10DataValues = sampleData.sample_values.slice(0, 10).reverse();
		sampleTop10DataOtuId = sampleData.otu_ids.slice(0, 10).reverse();
		sampleTop10DataOtuLabels = sampleData.otu_labels.slice(0, 10).reverse();

     // bar
     Plotly.restyle("bar", "x", [sampleTop10DataValues]);
     Plotly.restyle("bar", "y", [sampleTop10DataOtuId.map(outId => `OTU ${outId}`)]);
     Plotly.restyle("bar", "text", [sampleTop10DataOtuLabels]);

     // bubble
     Plotly.restyle('bubble', "x", [sampleDataOtuId]);
     Plotly.restyle('bubble', "y", [sampleDataValues]);
     Plotly.restyle('bubble', "text", [sampleDataOtuLabels]);


     // demo info
     SampleMetaData = data.metadata.filter(sample => sample.id == inputValue)[0];

     d3.select("#sample-metadata").html("");

     Object.entries(SampleMetaData).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

}
