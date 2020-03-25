
var searchBtn = $("#search-btn");
var cityDateRow = $("#city-date-row");
var tempRow = $("#temp-row");
var humidityRow = $("#humidity-row");
var windSpeedRow = $("#wind-speed-row");
var uvIndexRow = $("#uv-index-row");
var fiveDay = $("#five-day");
var searchHistoryDiv = $("#search-history");
var historyButtons = $(".btn-group");
var clearBtn = $("#clear-btn");


var searchList = JSON.parse(localStorage.getItem("searchList") || "[]");


var today = moment().format("dddd, MMMM Do YYYY")


renderButtons();

// render weather for last searched item on page load
if(searchList[0]){
    displayWeather(searchList[searchList.length-1]);
};

// display search history buttons
function renderButtons() {
    searchHistoryDiv.empty();
    for (var i = 0; i < searchList.length; i++) {

        var newBtn = $("<button>");
        newBtn.attr("class", "history-btn");
        newBtn.html(searchList[i]);
        searchHistoryDiv.prepend(newBtn);


    }
}

// populate full right side of page
function displayWeather(location) {


    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=cb7a43faa937786927c1d2517fab2d02&units=imperial"



    //first ajax request
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
      
        var newLat = response.coord.lat;
        var newLon = response.coord.lon;
     

        //fill map square
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: newLat, lng: newLon },
            zoom: 8
        });

        // city name and date headline
        var newHeaderH2 = $("<h1>");
        newHeaderH2.html(response.name + " <img src=\"https://openweathermap.org/img/w/" + response.weather[0].icon + ".png\"><br><h5>" + today + "</h5>");
        cityDateRow.empty();
        cityDateRow.append(newHeaderH2);

        // update temp line
        var newTempH4 = $("<h3>");
        var fTemp = response.main.temp;
        newTempH4.html("Temperature: " + fTemp + "&deg; F");
        tempRow.empty();
        tempRow.append(newTempH4);

        // update humidity line
        var newHumidityH4 = $("<h3>");
        newHumidityH4.text("Humidity: " + response.main.humidity + "%");
        humidityRow.empty();
        humidityRow.append(newHumidityH4);

        // update wind info
        var newWindH4 = $("<h3>");
        newWindH4.text("Wind: " + response.wind.speed + "Mph");
        windSpeedRow.empty();
        windSpeedRow.append(newWindH4)

              
        var query2URL = "https://api.openweathermap.org/data/2.5/forecast?appid=cb7a43faa937786927c1d2517fab2d02&units=imperial&id=" + response.id;
        
        $.ajax({
            url: query2URL,
            method: "GET"
        }).then(function (response) {
            fiveDay.empty();
            for (i = 0; i < response.list.length; i += 8) {
                var dateMs = response.list[i].dt_txt;
                var desc = response.list[i].weather[0].description;
                var temp = Math.round(response.list[i].main.temp);
                var humidity = response.list[i].main.humidity;
                var iconID = response.list[i].weather[0].icon;
  
                //create bootstrap card
                var newCard = $("<div>");
                newCard.attr("class", "card");

                //card list items
                var newUl = $("<ul>");
                newUl.attr("class", "list-group list-group-flush");
                var newDateLi = $("<li>");
                newDateLi.attr("class", "list-group-item date-line");
                var newDescLi = $("<li>");
                newDescLi.attr("class", "list-group-item");
                var newTempLi = $("<li>");
                newTempLi.attr("class", "list-group-item");
                var newHumidityLi = $("<li>");
                newHumidityLi.attr("class", "list-group-item");

                //update li text
                newDateLi.text(dateMs.slice(0, 10));
                newDescLi.html("<img src=\"https://openweathermap.org/img/w/" + iconID + ".png\">" + desc);
                newTempLi.html("Temp: " + temp + "&deg;");
                newHumidityLi.text("Humidity: " + humidity + "%");

                //put li into ul
                newUl.append(newDateLi);
                newUl.append(newDescLi);
                newUl.append(newTempLi);
                newUl.append(newHumidityLi);

                //put ul into card
                newCard.append(newUl);

                //put card on page
                fiveDay.append(newCard);
            }
        })

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=cb7a43faa937786927c1d2517fab2d02&lat=" + newLat + "&lon=" + newLon,
            method: "GET"
        }).then(function(response) {
            var uvIndex = response.value;
            var newUVH4 = $("<h4>");

            //set uv line
            newUVH4.text("UV Index: ");

            //set index number in span
            var newSpan = $("<span>");
            newSpan.html(uvIndex);
            
            //color span background
            if(uvIndex<3){
                newSpan.attr("style", "background-color: green;")
            } else if (uvIndex<6){
                newSpan.attr("style", "background-color: yellow;")
            } else if (uvIndex<8){
                newSpan.attr("style", "background-color: orange;")
            }else if (uvIndex<11){
                newSpan.attr("style", "background-color: red; color: white;")
            } else {
                newSpan.attr("style", "background-color: maroon; color: white;")
            }

            //add span to uv line
            newUVH4.append(newSpan);

            // update uv index line
            uvIndexRow.empty();
            uvIndexRow.append(newUVH4);
        });
    })
}


// search button clicked
searchBtn.on("click", function () {
    event.preventDefault();

    var $searchInput = $("#city-input").val();

    // append search item to history list
    searchList.push($searchInput);

    // save list to local using JSON stringify
    localStorage.setItem("searchList", JSON.stringify(searchList))

    // render updated list
    renderButtons();

    // render weather page
    displayWeather($searchInput);

    // clear the search field
    $("#city-input").empty();
})


// history button clicked
$(document).on("click", ".history-btn", function () {

    var city = $(this).text();
    displayWeather(city);

})

// clear button clicked
clearBtn.on("click", function () {

    localStorage.clear();
    renderButtons();

})

