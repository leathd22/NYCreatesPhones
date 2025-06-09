// Function that takes in the json data that has already been read and convert that text into an HTML table
function fillTable(jsonData) {
    // Create the beginning of the table
    let headers = Object.keys(jsonData[0]);
    let table = '<table style="width: 100%;" id="phoneList"><thread><tr id="headersT">';

    // Set up the headers for the table.  It was performed this way to allow the onclick sort to get the correct column.
    table += '<th onclick="sortTable(0)">Brand</th>';
    table += '<th onclick="sortTable(1)">Model</th>';
    table += '<th onclick="sortTable(2)">Storage</th>';
    table += '<th onclick="sortTable(3)">Color</th>';
    table += '<th onclick="sortTable(4)">Price</th>';
    table += '</tr></thread><tbody>';

    // Loop through each row of the json and add it to the table
    jsonData.forEach(row => {
        let brandf = document.getElementById('findBrand').innerHTML;
        let modelf = document.getElementById('findModel').innerHTML;
        let storef = document.getElementById('findStorage').innerHTML;
        let colorf = document.getElementById('findColor').innerHTML;
        let minpf = document.getElementById('findMinPrice').innerHTML;
        let maxpf = document.getElementById('findMaxPrice').innerHTML;

        // determine if the row fits the filtering criteria from the page.  If there is no current filtering, then everything should be displayed.  
        if ((brandf.toUpperCase().includes(row['Brand'].toUpperCase()) || brandf === '') 
            && (modelf.toUpperCase().includes(row['Model'].toUpperCase()) || modelf === '') 
            && (storef.toUpperCase().includes(row['Storage'].toUpperCase()) || storef === '') 
            && (colorf.toUpperCase().includes(row['Color'].toUpperCase()) || colorf === '')
            ) {
            // If there is no filtering on the price, add it
            if (minpf === '' && maxpf === '') {
                table += '<tr onclick="toggleClass(this,\'selected\');">';
                headers.forEach(header => table += '<td>'+row[header]+'</td>');
                table += '</tr>';
            } else if ((parseFloat(minpf) <= row['Price'] && parseFloat(maxpf) >= row['Price']) 
                || (minpf === '' && parseFloat(maxpf) >= row['Price']) 
                || (parseFloat(minpf) <= row['Price'] && maxpf === '')) {
                // There is filtering on the price, we have no determined if this row fits into the criteria, even if one of the two is still empty
                table += '<tr onclick="toggleClass(this,\'selected\');">';
                headers.forEach(header => table += '<td>'+row[header]+'</td>');
                table += '</tr>';
            }
        }
    });

    // Finish out the table and add it to the correct element within the HTML page, and sort it on the Brand initially
    table += '</tbody></table>';
    document.getElementById('table-container').innerHTML = table;
    sortTable(0);
}

// Sort function that will allow for sorting on any of the columns
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("phoneList");
    switching = true;
    dir = "asc";
    var h = document.getElementById("headersT").getElementsByTagName("TH");
    for (i = 0; i < h.length; i++) {
        temp = h[i].innerHTML
        if (temp.charAt(temp.length - 1) === '^' || temp.charAt(temp.length - 1) === 'v') {
            h[i].innerHTML = h[i].innerHTML.slice(0, -2);
        }
    }
    h[n].innerHTML += ' v'
    
    // Continue to loop through until no more switching of rows is needed, and it is all sorted
    while (switching) {
        // set defaults for this iteration
        switching = false;
        rows = table.rows;
        
        // Loop through all table rows except first (headers)
        for (i = 1; i < (rows.length - 1); i++) {
            // Assume no switching
            shouldSwitch = false;
            
            // Get the values for the row that we are sorting on
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            // If we are sorting on the price, convert to numbers
            if (n === 4) {
                xval = Number(x.innerHTML)
                yval = Number(y.innerHTML)
            } else {
                xval = x.innerHTML.toLowerCase()
                yval = y.innerHTML.toLowerCase()
            }
            
            // Determine if the two rows need to be switched
            if (dir == "asc") {
                if (xval > yval) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
                } else if (dir == "desc") {
                if (xval < yval) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }

        // We found we need to switch some rows
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            
            switchcount ++;
        } else {
            // If the order is ascending and it is already sorted, descend the list instead, rerunning while loop
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
                h[n].innerHTML = h[n].innerHTML.slice(0, -2) + ' ^';
            }
        }
    }
}

// Main function that pulls the data from the json file and puts it into the table
async function readJson() {
    const url = 'cellphonedata.json'
    try {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                fillTable(data)
            })
            .catch(error => console.error('Error fetching JSON:', error));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to toggle selecting a row in the table
// If it is not selected, select it.  If it is selected, deselect it
function toggleClass(el, className) {
    if (el.className.indexOf(className) >= 0) {
        console.log("In the IF");
        el.className = el.className.replace(className,"");
    }
    else {
        el.className  += className;
    }
}

// Remove the filter data from the fields and fetch the data from the json again without any filter criteria
function clearFilters() {
    document.getElementById('findBrand').innerHTML = '';
    document.getElementById('findModel').innerHTML = '';
    document.getElementById('findStorage').innerHTML = '';
    document.getElementById('findColor').innerHTML = '';
    document.getElementById('findMinPrice').innerHTML = '';
    document.getElementById('findMaxPrice').innerHTML = '';
    readJson();
}

// Listener to see if the enter key was pressed.  If so, then we will run the filtering
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btnRun").click();
    }
});

// Button for closing the form to enter a new phone, it is in the top left of the window.
function btnClose() {
    document.getElementById("popupOverlay").style.display = "none"; // Hide popup
}

// Button to save the newly entered phone details into the data storage
function btnSave() {
    // Get all of the entered data
    var nb = document.getElementById("newBrand").innerHTML;
    var nm = document.getElementById("newModel").innerHTML;
    var ns = document.getElementById("newStorage").innerHTML;
    var nc = document.getElementById("newColor").innerHTML;
    var np = parseFloat(document.getElementById("newPrice").innerHTML);

    // Determine if we have valid data for the new phone
    if (nb === '' || nm === '' || ns === '' || nc === '' || np === '') {
        alert("Please make sure you have filled in each of the fields prior to continuing.");
    } else if (isNaN(np)) {
        alert("Please make sure to only enter a number in the price column.");
    } else {
        // The new phone has valid entries, so we can add it to the list!
        var newPhone = {nb, nm, ns, nc, np};
        console.log(newPhone);
        // THIS IS WHERE YOU WILL SAVE THE NEW DATA TO THE FILE

        document.getElementById("popupOverlay").style.display = "none"; // Hide popup
    }
}

function btnStartAdd() {
    document.getElementById("popupOverlay").style.display = "flex"; // Show popup
}

// Funcation to remove highlighted phones from the list (simulating them being sold)
function soldPhones() {
    table = document.getElementById("phoneList");
    rows = table.rows;

    // Firstly, determine if the user clicked this button intentionally
    if (confirm("Are you sure you want to remove the highlighted phones from the list?")) {
        const url = 'cellphonedata.json'
        try {
            // Read the json data
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // Loop through the table and the json data to find the matching entries
                    for (i = 1; i < (rows.length - 1); i++) {
                        if (rows[i].className === 'selected') {
                            for (t = data.length-1; t >= 0; t--) {
                                // Determine if the current two are the same entries between the json and the html
                                if (data[t].Brand === rows[i].getElementsByTagName("TD")[0].innerHTML 
                                    && data[t].Model === rows[i].getElementsByTagName("TD")[1].innerHTML 
                                    && data[t].Storage === rows[i].getElementsByTagName("TD")[2].innerHTML 
                                    && data[t].Color === rows[i].getElementsByTagName("TD")[3].innerHTML 
                                    && data[t].Price === Number(rows[i].getElementsByTagName("TD")[4].innerHTML)) {
                                    // Remove the row from the table
                                    console.log("Removing:  " + data[t]);
                                    data.splice(t, 1);
                                }
                            }
                        }
                    }
                    console.log(data);

                    // THIS IS WHERE YOU WILL SAVE THE FILE TO THE ORIGINAL LOCATION (url)
                })
                .catch(error => console.error('Error fetching JSON:', error));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
        readJson();
    }
}

// Listener to watch for clicking of the enter key to rerun the filter on the list
window.addEventListener("click", function(event) {
    const popupOverlay = document.getElementById("popupOverlay");
    if (event.target === popupOverlay) {
        popupOverlay.style.display = "none"; // Hide popup if clicked outside
    }
});
