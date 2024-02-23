// Store json url in variable
const url = "http://127.0.0.1:5000/raw-lung-cancer-data";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

let states = [];

// Initialize the dashboard and plots
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select('#selDataset');

    // Use D3 to get the state abbreviations for populating the dropdown selections
    d3.json(url).then((data) => {

        // Create an open list to hold the state abbreviations
        states = [];

        // Loop through the data to filter out the states
        data.forEach((state) => {
            //  //  //  console.log(states)
            state = state.LocationAbbr
            //  //  //  console.log(state)
            states.push(state)
        });
        //  //  //  console.log(states)

        // Remove the duplicates from the list of state abbreviations
        states = states.filter((item,
            index) => states.indexOf(item) === index);
            //  //  //  console.log(states)
        
        // Loop through the "states" array and append each state abbreviation to the dropdown menu
        states.forEach((state) => {
            dropdownMenu.append("option").text(state).property("value", state);
        });

        // Empty list for holding stratifications
        let strats = []

        // Loop to get the stratifications
        data.forEach((strat) => {
            //  //  //  console.log(strats)
            strat = strat.Stratification1
            //  //  //  console.log(strat)
        });

        // Empty list for holding the stratification values
        let stratValues = []

        // Loop to get the Data Value for each stratification
        data.forEach((stratValue) => {
            //  //  //  console.log(stratValues)
            stratValue = stratValue.DataValue
            //  //  //  console.log(stratValue)
        });

        // Assign the first state name to a variable
        let first_state_name  = states[0];

        // Create the names for the functions that will be used (Bar Chart)
        barChart(first_state_name);
    });
};


// BarChart Function
function barChart(selectedState) {

    // Fetch all of the data using D3
    d3.json(url).then((data) => {

        // Retreive the sample data
        let stateData = data;

        // Filter the state data based on the state location abbreviation
        let filteredValues = stateData.filter(state => state.LocationAbbr === selectedState && state.StratificationCategoryID1 === "RACE");
        //  //  console.log(filteredValues)

        DataValues = []
        Stratifications = []

        // Loop to get the stratifications
        filteredValues.forEach((value) => {
            //  //  console.log(value)
            //  //  console.log(value.Stratification1)
            //  //  console.log(value.DataValue)
            DataValues.push(value.DataValue)
            Stratifications.push(value.Stratification1)
        });
        //  //  console.log(DataValues, Stratifications)


        // // Assign the first value
        // let obj = filteredValues[0];

        // Get the Stratifications and Data Values
        // let Stratification1= obj.Stratification1;
        // let DataValue = obj.DataValue;
        
        // Log the data to the console
        // console.log(Stratification1, DataValue);

       // Use Plotly to create the bar chart
        // Plotly.newPlot('bar', [trace], layout)
        var data = [
            {
              x: Stratifications,
              y: DataValues,
              type: 'bar'
            }
          ];
          
        Plotly.newPlot('bar', data);
        // Pie
        // Filter the state data based on the state location abbreviation
        filteredValues = stateData.filter(state => state.LocationAbbr === selectedState && state.StratificationCategoryID1 === "GENDER");
        //  //  console.log(filteredValues)

        DataValues = []
        Stratifications = []

        // Loop to get the stratifications
        filteredValues.forEach((value) => {
            //  //  console.log(value)
            //  //  console.log(value.Stratification1)
            //  //  console.log(value.DataValue)
            DataValues.push(value.DataValue)
            Stratifications.push(value.Stratification1)
        });
        //  //  console.log(DataValues, Stratifications)
        var data = [{
            values: DataValues,
            labels: Stratifications,
            type: 'pie'
          }];
          
          var layout = {
            height: 400,
            width: 500
          };
          
          Plotly.newPlot('pie', data, layout);
        
        // data manipulation for neg-stack chart
        // sorting data by state abbr alphabetical order   
        let sortedData = stateData.sort(function(x, y){
            return d3.ascending(x.LocationAbbr, y.LocationAbbr);
        });
        // separating US from the data
        usData = sortedData.filter(obj => obj.LocationAbbr === "US")
        sortedData = sortedData.filter(obj => obj.LocationAbbr !== "US")
        console.log(usData);
        console.log(sortedData);

        // Create an open list to hold the state abbreviations
        statesB = [];
        // Loop through the data to filter out the states
        sortedData.forEach((state) => {
            state = state.LocationAbbr
            statesB.push(state);
        });
        // Remove the duplicates from the list of state abbreviations
        statesB = statesB.filter((item,
            index) => statesB.indexOf(item) === index);
        
        console.log(statesB);
        
        // filter male and female data
        let maleValues = sortedData.filter(state => state.Stratification1 === "Male");
        console.log(maleValues)
        
        let femaleValues = sortedData.filter(state => state.Stratification1 === "Female");
        console.log(femaleValues)

        // creating empty arrays
        f_Values = []
        m_Values = []

        // Loop to get the male and female values and push to the above arrays
        maleValues.forEach((value) => {
            m_Values.push(-parseInt(value.DataValue, 10)) // *(-1)to be on the left side of axis
        });

        femaleValues.forEach((value) => {
            f_Values.push(parseInt(value.DataValue, 10))
        });
        
        console.log(m_Values)
        console.log(f_Values)        

        // HIGHCHARTS template: negative stack chart:
        Highcharts.Templating.helpers.abs = value => Math.abs(value);

        // state categories
        const categories = statesB;

        Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            legend: {
                itemStyle: {
                    fontSize: '15px'
                }
            },
            title: {
                text: 'Distribution of the Average Annual Incidence of Cancer of the Lung and Bronchus per 100,000 by Gender and State',
                align: 'left',
                style: {
                    fontSize:'20px'
                }
            },
            xAxis: [{
                categories: categories,
                reversed: false,
                labels: {
                    step: 1,
                    style: {
                        fontSize:'15px'
                    }
                }
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: categories,
                linkedTo: 0,
                labels: {
                    step: 1,
                    style: {
                        fontSize:'15px'
                    }
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    format: '{abs value}',
                    style: {
                        fontSize:'15px'
                    }
                }
            },

            plotOptions: {
                series: {
                    stacking: 'normal',
                    borderRadius: '50%',
                    groupPadding: 0,
                    pointPadding: 0
                }
            },

            tooltip: {
                format: '<b>{series.name}, {point.category}</b><br/>' +
                    'Cancer Incidence: <b>{(abs point.y):.1f}</b> per 100,000',
                style: {
                    fontSize:'13px'
                }
            },

            series: [{
                name: 'Male',
                data: m_Values,
                color: 'rgb(255, 127, 14)',
            }, {
                name: 'Female',
                data: f_Values,
                color: 'rgb(31, 119, 180)'
            }],

            exporting: {
                enabled: false
            }
        });
    });
};

// Create a Function that updates the dashboard when the state is changed
function optionChanged(selectedState) { 

    // Log the new value
    //  //  console.log(selectedState); 

    // Call all functions
    barChart(selectedState);
};

// Initialize
init();

//Create variable named url which points to url (website)  
//THIS WEBSITE CONTAINS YOUR CANCER DATA
//Contains cases by state, then by gender or race from 2015-2019

//define color function, based on density parameter.
function getColor(d) {
  return d > 10000 ? '#800026' :
         d > 8000  ? '#BD0026' :
         d > 6000  ? '#E31A1C' :
         d > 4000  ? '#FC4E2A' :
         d > 2000   ? '#FD8D3C' :
         d > 1000   ? '#FEB24C' :
         d > 500   ? '#FED976' :
                    '#FFEDA0';
}

function getStateAbbr(stateName) {
  return stateName == "Alabama" ? "AL":
         stateName == "Alaska"  ? "AK":
         stateName == "Arizona"  ? "AZ":
         stateName == "Arkansas"  ? "AR":
         stateName == "California"  ? "CA":
         stateName == "Colorado"  ? "CO":
         stateName == "Connecticut"  ? "CT":
         stateName == "Delaware"  ? "DE":
         stateName == "Florida"  ? "FL":
         stateName == "Georgia"  ? "GA":
         stateName == "Hawaii"  ? "HI":
         stateName == "Idaho"  ? "ID":
         stateName == "Illinois"  ? "IL":
         stateName == "Indiana"  ? "IN":
         stateName == "Iowa"  ? "IA":
         stateName == "Kansas"  ? "KS":
         stateName == "Kentucky"  ? "KY":
         stateName == "Louisiana"  ? "LA":
         stateName == "Maine"  ? "ME":
         stateName == "Maryland"  ? "MD":
         stateName == "Massachusetts"  ? "MA":
         stateName == "Michigan"  ? "MI":
         stateName == "Minnesota"  ? "MN":
         stateName == "Mississippi"  ? "MS":
         stateName == "Missouri"  ? "MO":
         stateName == "Montana"  ? "MT":
         stateName == "Nebraska"  ? "NE":
         stateName == "Nevada"  ? "NV":
         stateName == "New Hampshire"  ? "NH":
         stateName == "New Jersey"  ? "NJ":
         stateName == "New Mexico"  ? "NM":
         stateName == "New York"  ? "NY":
         stateName == "North Carolina"  ? "NC":
         stateName == "North Dakota"  ? "ND":
         stateName == "Ohio"  ? "OH":
         stateName == "Oklahoma"  ? "OK":
         stateName == "Oregon"  ? "OR":
         stateName == "Pennsylvania"  ? "PA":
         stateName == "Rhode Island"  ? "RI":
         stateName == "South Carolina"  ? "SC":
         stateName == "South Dakota"  ? "SD":
         stateName == "Tennessee"  ? "TN":
         stateName == "Texas"  ? "TX":
         stateName == "Utah"  ? "UT":
         stateName == "Vermont"  ? "VT":
         stateName == "Virginia"  ? "VA":
         stateName == "Washington"  ? "WA":
         stateName == "West Virginia"  ? "WV":
         stateName == "Wyoming"  ? "WY":
         stateName == "District of Columbia"  ? "DC":
         stateName == "Wisconsin"  ? "WI":
         stateName == "Puerto Rico"  ? "PR":
         stateName;





}

//create a map color based on population density
function kyle_custom_style(feature) {
  let stateAbbr = getStateAbbr(feature.properties.name);
  // console.log(stateAbbr);

  let stateData = cancerData.filter( function(record){
      return record.LocationAbbr == stateAbbr && record.Stratification1 == "Overall";
  });
  
  let overallCancerInc = stateData[0].DataValue;
  // console.log(overallCancerInc);

  return {
      fillColor: getColor(overallCancerInc),
      weight: 2,
      opacity: 1,
      color: 'black',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

//define mouseover when moved on state
var geojson;
var cancerData;
function highlightFeature(e) {
     var layer = e.target;
     

  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });

  layer.bringToFront();
  info.update(layer.feature.properties);
}
//define mouseoff when moved off state
function resetHighlight(e) {
  
  geojson.resetStyle(e.target);
  info.update();
}

function kyle_custom_features(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight

  });
}
// custom info control code to see incidences, by state overal incidences
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a  "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {

  let overallCancerInc;

  if(props){
      let stateAbbr = getStateAbbr(props.name);
      // console.log(stateAbbr);
  
      let stateData = cancerData.filter( function(record){
          return record.LocationAbbr == stateAbbr && record.Stratification1 == "Overall";
      });
      
      overallCancerInc = stateData[0].DataValue;
      // console.log(overallCancerInc);
  }


  this._div.innerHTML = '<h4>Overall Lung Cancer Incidences by State</h4>' +  (props ?
      '<b>' + props.name + '</b><br />' + overallCancerInc + ' Overall'
      : 'Hover over a state');
      // console.log(props);
};


// Use D3 library to fetch data from the url variable



d3.json(url).then(function (data) {
  // console.log(data);
  cancerData = data;
 
  // console.log(statesData);
  statesData.features = statesData.features.filter( function(state){
      return state.properties.name != "Puerto Rico";
  });

  geojson = L.geoJson(statesData, {style: kyle_custom_style ,onEachFeature: kyle_custom_features} )

  //Create base Leaflet map
  let myMap = L.map("map", {
      center: [38.58, -99.58],
      zoom: 5,
      layers: [geojson]

  })
  //Create base tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreeMap</a> contributors'
  }).addTo(myMap);
 

  info.addTo(myMap);
});
