# NYCreatesPhones
Phone inventory interface

# Front End Files
- index.html
- indexStyle.css
- operateUpdate.js

# Back End Files
- cellphonedata.json
- cellphonedata.txt
- convertTextToJSon.py
- run_convert.bat

# Functionality
Provides list from the json file to be shown to the client.  The list can be filtered through editable fields at the top.  Clicking enter will run the filter, or clicking on the filter button.  There is a button to clear the filter.  At this time, the add or remove buttons do not properly work.  They do everything except actually updating the json file with the new data.  The removal button works through the selecting of rows in the table, so there is a functionality that allows the user to select and deselect different rows from the table.  The add button does have a pop up that gives the option to enter the data, including some data validation, however, it does not currently actually write this data into the json file due to the JavaScript framework not having this functionality.  <br>
Backend functionality is simply a batch file that runs a python script to convert the text file into a json for the easy of utilizing within the rest of the software.  

# Future Updates
Convert this project away from solely JavaScript, and use another software like Node.js.  This would allow for the add or remove buttons to work properly, because it would allow for server side updates.  The current JavaScript does not have priviledge to edit files located on the desktop, which is how the json files are currently being stored.  <br>
Additionally, another update would be to utilize icons to demonstrate which direction and which columns the data is being sorted in.  Currently it is just using v and ^, but using icons to show the direction will be easier for a user to know how it is being sorted.  
