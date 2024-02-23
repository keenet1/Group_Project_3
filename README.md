# Incidence of Lung and Bronchus Cancer in the United States (2015 - 2019)
<font size="3">**Group-Project-3: Team 6**  
**Contributors:** Kyle Dalton, Faith Hall, Thomas Keene, Cassia Yoon  
**Github link:** https://github.com/Faith-Hall/Lung-Cancer-Project3-Group6  
**Presentation link:** https://docs.google.com/presentation/d/1is7is2i6eAjvKeqRUmfpBk0Rcqw2cOpVEvVM5CwVK7U/edit?usp=sharing or [pdf file](/presentation/group-project-3-team-6-presentation.pdf)  
</font>  

# Project Overview  
In epidemiology, incidence is a measure of the probability of occurrence of a given medical condition in a population within a specified period of time.

The aim of this project is to explore the Centers for Disease Control and Prevention (CDC) cancer dataset to uncover potential incidence patterns of lung and bronchus cancer within the United States from 2015 through 2019. Here, we examine the relationships between demographic categories (race/ethnicity and gender), place of residence, and diagnoses of cancer derived from the data.

# To See the Visualizations  
1. Run the [flask file](/flask-server.py) in the terminal.  
2. Run the [html code](/Website/index_bar.html) in a browser.   

# Data Preparation
The dataset "U.S. Chronic Disease Indicators: Cancer" was obtained from the Centers for Disease Control and Prevention (CDC) website (linked above) as a downloadable CSV file. Once downloaded, the data was prepared for subsequent analysis as follows:
- The raw CSV data was first filtered on "Question" to obtain only the records for "Cancer of the lung and bronchus, incidence"
- The dataset was then filtered on "YearStart" and "YearEnd" to obtain only those records for the time period of interest (2015 - 2019)
- The dataset was then filtered on "DataValueType" to obtain only those records for "Average Annual Number"
- The dataset was then cleaned by the removal of extraneous columns in order to leave only the columns of interest ("YearStart", "YearEnd", "LocationAbbr", "Question", "DataValueType", "DataValue", "DataValueAlt", "StratificationCategory1", "Stratification1", "LocationID", StratificationCategoryID1", and "StratificationID1")

Once filtered, sorted, and cleaned as described above, the csv file was then imported into a SQLite database.

Finally, Flask was employed to serve the data from the SQLite database as a JSON object.

# Visualizing the Data
To explore the dataset, the following visualizations were created for our website:

Interactive map:
- The interactive map allows the user to obtain the data for the overall incidence of lung and bronchus cancer. To use the map, simply mouse over the state of interest, and observe the data displayed in the pop-up:

![Screenshot 2023-10-23 at 3 15 23 PM](https://github.com/Faith-Hall/Lung-Cancer-Project3-Group6/assets/137319054/c31fac0c-3e51-4053-9d3c-951bbb1fbb9a)

Interactive bar and pie charts:
- The following section of the website "Lung Cancer By Ethnicity and Gender Dashboard" allows the user to explore trends in incidence of lung and bronchus cancer based on both gender and ethnicity by state. Selecting a state from the drop-down menu subsequently populates bar charts and pie charts based on these stratifications. Examples are shown in the screen captures below:

![Screenshot 2023-10-23 at 3 32 18 PM](https://github.com/Faith-Hall/Lung-Cancer-Project3-Group6/assets/137319054/3539a6aa-85d8-4ea6-833b-181d68eef35c)

Interactive negative stacked bar chart:
- The negative stacked bar chart shows the overall picture of the incidences of lung and bronchus cancer by gender by state. The user is able to scroll their mouse over each bar to see the state, gender and the average annual lung cancer incidence per 100,000. Examples are shown in the screen captures below:

![negative-stacked-chart](/Readme_imgs/A_4_chart1.png)

# Analyzing the Data and Conclusions
By studying the map, we can observe that lung cancer appears to be most prevalent near major bodies of water (The Pacific and Atlantic Oceans, and the Great Lakes region) except for the New England Region.  

| US Regions                                 | Interactive Map                     |
| ------------------------------------------ | ----------------------------------- |
| ![us-regions](/Readme_imgs/regions-us.png) | ![a1-map](/Readme_imgs/A_1_map.png) |

The interactive bar and pie charts allowed us to explore the data for each state with more ease.  

Upon studying them, we found that there was missing data, especially when it came to race/ethnicities. And in the case of Kansas, there is only data for the Hispanic category. We suspect that this is likely due to people leaving that information blank. This illustrates the limitation of our data.  

| Visualization                               | Database                                        |
| ------------------------------------------- | ----------------------------------------------- |
| ![IL-img](/Readme_imgs/IL_missing_bars.png) | ![sqlite-img](/Readme_imgs/IL_missing_data.png) |  

The gender pie charts showed that almost all states had higher incidence of cancer in males than females. The exception was Minnesota.  

![MN-pie](/Readme_imgs/pie-trend.png)  

By studying the stacked bar chart, we can observe that there is an even distributions between genders across the states (the bars look like a mirror image from the center). This suggested that there was no significant statistical difference between male and female incidence of cancer.  

![negative-stacked-chart](/Readme_imgs/A_4_chart1_smaller.png)  

This was then confirmed with a [t-test analysis](/analysis/analysis_gender.ipynb) which showed a high p-value.  

![ttest-results](/Readme_imgs/ttest_results.png)  

For future considerations, it would be interesting to cross-reference this cancer dataset with US census data, weather data, and air-quality data.

# Resources  
Dataset used:  
- Cancer dataset: https://data.cdc.gov/Chronic-Disease-Indicators/U-S-Chronic-Disease-Indicators-Cancer/u9ek-bct3  

Resources used for JS library Highcharts:
- https://www.highcharts.com/
- https://www.highcharts.com/demo/highcharts/bar-negative-stack
- https://api.highcharts.com/highcharts/

Resources used for interactive map:
- https://leafletjs.com
  
Tools:
- https://www.sqlite.org/index.html
- https://flask.palletsprojects.com/en/3.0.x/

Database help:
- Used to import csv to SQlite: https://stackoverflow.com/questions/14947916/import-csv-to-sqlite
- https://stackoverflow.com/questions/23765681/sqlalchemy-automap-does-not-create-class-for-tables-without-primary-key

# Acknowledgements
We wish to thank our teaching staff:
- Hunter Hollis
- Sam Espe
- Randy Sendek
- Kourt Bailey
