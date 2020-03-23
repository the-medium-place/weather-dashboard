
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


function renderButtons() {
    searchHistoryDiv.empty();
    for (var i = 0; i < searchList.length; i++) {

        var newBtn = $("<button>");
        newBtn.attr("class", "history-btn");
        newBtn.html(searchList[i] + "<br>");
        searchHistoryDiv.append(newBtn);


    }
}


searchBtn.on("click", function () {
    event.preventDefault();

    var $searchInput = $("#city-input").val();

    // append search item to history list
    searchList.push($searchInput);
 
    // save list to local using JSON stringify
    localStorage.setItem("searchList", JSON.stringify(searchList))

    renderButtons();
    

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $searchInput + "&appid=cb7a43faa937786927c1d2517fab2d02&units=imperial"



    //first ajax request
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // city name and date headline
        var newHeaderH2 = $("<h1>");
        newHeaderH2.html(response.name + " <img src=\"http://openweathermap.org/img/w/" + response.weather[0].icon + ".png\"><br><h5>" + today + "</h5>");
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

        var newUVH4 = $("<h3>");



        console.log(response);
        console.log(response.weather[0].description)
        var query2URL = "https://api.openweathermap.org/data/2.5/forecast?appid=cb7a43faa937786927c1d2517fab2d02&units=imperial&id=" + response.id;
        console.log(query2URL);

        $.ajax({
            url: query2URL,
            method: "GET"
        }).then(function (response) {
            fiveDay.empty();
            for (i = 2; i < response.list.length; i += 8) {
                var dateMs = response.list[i].dt_txt;
                var desc = response.list[i].weather[0].description;
                var temp = Math.round(response.list[i].main.temp);
                var humidity = response.list[i].main.humidity;
                var iconID = response.list[i].weather[0].icon;

                console.log(response.list[i]);
                //create bootstrap card
                var newCard = $("<div>");
                newCard.attr("class", "card");

                //card list items
                var newUl = $("<ul>");
                newUl.attr("class", "list-group list-group-flush");
                var newDateLi = $("<li>");
                newDateLi.attr("class", "list-group-item");
                var newDescLi = $("<li>");
                newDescLi.attr("class", "list-group-item");
                var newTempLi = $("<li>");
                newTempLi.attr("class", "list-group-item");
                var newHumidityLi = $("<li>");
                newHumidityLi.attr("class", "list-group-item");

                //update li text
                newDateLi.text(dateMs);
                newDescLi.html("<img src=\"http://openweathermap.org/img/w/" + iconID + ".png\">" + desc);
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
    })
})


historyButtons.on("click", function(){

    console.log($(this).val());

})

clearBtn.on("click", function (){

    localStorage.clear();
    renderButtons();

})

