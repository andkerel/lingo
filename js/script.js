
$(document).ready(function() {

    
    ///////////////////////////////////
    //REQUEST TWEETS FROM TWITTER API//
    ///////////////////////////////////

    torontoTweetsArray = [];
    londonTweetsArray = [];
    singTweetsArray = [];
    sydneyTweetsArray = [];
    nycTweetsArray = [];

    var torontoSelect, londonSelect, singSelect, sydneySelect, nycSelect;

    //load all information before manipulating
    var loadTweets = $.when(

        //GET Toronto Tweets
        $.ajax({
            type:"GET",
            url:"php/getTweetsToronto.php",
            dataType: "json"
        }),

        //GET London Tweets
        $.ajax({
            type:"GET",
            url:"php/getTweetsLondon.php",
            dataType: "json"
        }),

        //GET Singapore Tweets
        $.ajax({
            type:"GET",
            url:"php/getTweetsSingapore.php",
            dataType: "json"
        }),

        //GET Sydney Tweets
        $.ajax({
            type:"GET",
            url:"php/getTweetsSydney.php",
            dataType: "json"
        }),

        //GET NYC Tweets
        $.ajax({
            type:"GET",
            url:"php/getTweetsNewYork.php",
            dataType: "json"
        }),

        //GET WORD BANK
        $.ajax({
            type:"POST",
            url:"php/select-slang.php",
            dataType: "json"
        })


    );

    loadTweets.done(function(toronto, london, sing, sydney, nyc, wordList) {

        ////////////////////////
        //FLIP LOAD SCREEN OFF//
        ////////////////////////
        $("html").css({overflow: 'hidden' });
        $('html').bind('touchmove', function(e){e.preventDefault()});

        $('html').waitForImages({
            waitForAll: true,
            finished: function() {
                hideloadingdiv();
            }  
        });

        function hideloadingdiv() {
            $("#loading").css('display', "none");
            $('html').unbind('touchmove');
        }




        /////////////////////
        //FIND WORD MATCHES//
        /////////////////////

        //fallback - find lowest tweet count array so loop will still run
            // if there is a count <100
        var tweetMin = Math.min(toronto[0].length, london[0].length, sing[0].length, sydney[0].length, nyc[0].length);
        
        //select text from tweets
        for (var t=0; t<tweetMin; t++) {
            torontoTweetsArray.push(toronto[0][t].text);
            londonTweetsArray.push(london[0][t].text);
            singTweetsArray.push(sing[0][t].text);
            sydneyTweetsArray.push(sydney[0][t].text);
            nycTweetsArray.push(nyc[0][t].text);
        }

        //join arrays to strings
        var torText = torontoTweetsArray.join(" ");
        var lonText = londonTweetsArray.join(" ");
        var singText = singTweetsArray.join(" ");
        var sydText = sydneyTweetsArray.join(" ");
        var nycText = nycTweetsArray.join(" ");

        //compile city-text object
        citiesText = [{"name":"Toronto", "string":torText}, {"name":"London", "string":lonText}, {"name":"Singapore", "string":singText}, {"name":"Sydney", "string":sydText}, {"name":"NYC", "string":nycText}];
        totalText = torText.concat(lonText).concat(singText).concat(sydText).concat(nycText);

        // //pick random showcase tweet
        // var rand = Math.floor(Math.random()*100);

        // torontoSelect = toronto[0][rand];
        // londonSelect = london[0][rand];
        // singSelect = sing[0][rand];
        // sydneySelect = sydney[0][rand];
        // nycSelect = nyc[0][rand];

        // //available selection options
        // __Select.timestamp;
        // __Select.text;
        // __Select.screen_name;
        // __Select.user;

        //sample slang array; to come from database later
        var slangArray = wordList[0];
        // var slangArray = slang.split(",");

        //initialize associative array to hold regex expressions
        var regex = [];

        //compile array of regex expressions
        for (var s=0; s<slangArray.length; s++) {

            //create regex expressions
            var re = new RegExp('\( '+slangArray[s]+' \)', 'gi')

            //assign keys
            var keys = ["name", "exp"];
            //assign values
            var values = [slangArray[s], re];

            //placeholder for regex associative array completion
            var placeholder = {};
            for (var k=0; k<keys.length; k++) {
                placeholder[keys[k]] = values[k];
            }

            //push each object into associative array
            regex.push(placeholder);
        }

        //Total Matches//
        /////////////////

        var totalMatches = [];
        var totalObj = {};

        //compare each word regex to whole word list
        for (var t=0; t<regex.length; t++) {

            if (totalText.match(regex[t].exp)) {

                var matchArray = totalText.match(regex[t].exp);

                matchCount = matchArray.length;

                totalObj= {
                    "word": regex[t].name,
                    "count": matchCount
                };
                
                totalMatches.push(totalObj);
            }
        } 

        //City-Specific Matches//
        /////////////////////////

        //initialize object to hold matches output
        var matches = [{"Toronto":[]}, {"London":[]}, {"Singapore":[]}, {"Sydney":[]}, {"NYC":[]}];
        var cityObj = {};

        //loop through cities text banks
        for (var c=0; c<citiesText.length; c++) {

            var keys = [];
            var values = [];
            var matchCount;

            //loop through regex expressions and match
            for (var r=0; r<regex.length; r++) {

                if (citiesText[c].string.match(regex[r].exp)) {

                    var matchArray = (citiesText[c].string).match(regex[r].exp);

                    matchCount = matchArray.length;

                    cityObj= {
                        "word": regex[r].name,
                        "count": matchCount
                    };
                    
                    matches[c][citiesText[c].name].push(cityObj);

                } 

            }
        }

        ///////////////////////
        //GENERATE WORD CLOUD//
        ///////////////////////

        //default view = total
        var tagTemp = totalMatches;

        //initialize custom scaling
        var intScaleTemp = 0.5;

        createCloud();

        //change cities
        $('.city').click(function() {
            if ($(this).attr('id') == "Toronto") {
                tagTemp = matches[0]['Toronto'];
                intScaleTemp = 3;
                createCloud();
                return false;
            } else if ($(this).attr('id') == "London") {
                tagTemp = matches[1]['London'];
                intScaleTemp = 3;
                createCloud();
                return false;
            } else if ($(this).attr('id') == "Singapore") {
                tagTemp = matches[2]['Singapore'];
                intScaleTemp = 3;
                createCloud();
                return false;
            } else if ($(this).attr('id') == "Sydney") {
                tagTemp = matches[3]['Sydney'];
                intScaleTemp = 3;
                createCloud();
                return false;
            } else if ($(this).attr('id') == "NYC") {
                tagTemp = matches[4]['NYC'];
                intScaleTemp = 3;
                createCloud();
                return false;
            } else if ($(this).attr('id') == "All") {
                tagTemp = totalMatches;
                intScaleTemp = 0.5;
                createCloud();
                return false;
            } else {
                console.log("fail");
            }

        })

        function createCloud() {

            //reset div
            $('#vis').empty();

            var tags = tagTemp;
            var intScale = intScaleTemp;

            //word cloud slightly modified from version given by Julien Renaux
            //found at https://github.com/shprink/d3js-wordcloud

            var fill = d3.scale.category20b()
            .range(["#681379", "#69A3CF" , "#B7CB3D"]);

            var w = window.innerWidth,
                    h = window.innerHeight;

            var max,
                    fontSize;

            var layout = d3.layout.cloud()
                    .timeInterval(Infinity)
                    .size([w, h])
                    .fontSize(function(d) {
                        return fontSize(+d.count);
                    })
                    .text(function(d) {
                        return d.word;
                    })
                    .on("end", draw);

            var svg = d3.select("#vis").append("svg")
                    .attr("width", w)
                    .attr("height", h);

            var vis = svg.append("g").attr("transform", "translate(" + [w >>> 1, h >>> 1] + ")");

            update();

            window.onresize = function(event) {
                update();
            };

            function draw(data, bounds) {
                var w = window.innerWidth,
                    h = window.innerHeight;

                svg.attr("width", w).attr("height", h);

                scale = bounds ? Math.min(
                        w / Math.abs(bounds[1].x - w / 2),
                        w / Math.abs(bounds[0].x - w / 2),
                        h / Math.abs(bounds[1].y - h / 2),
                        h / Math.abs(bounds[0].y - h / 2)) / 2 : 2;

                var text = vis.selectAll("text")
                        .data(data, function(d) {
                            return d.text.toLowerCase();
                        });
                text.transition()
                        .duration(1000)
                        .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .style("font-size", function(d) {
                            return d.size + "px";
                        });
                text.enter().append("text")
                        .attr("text-anchor", "middle")
                        .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .style("font-size", function(d) {
                            return d.size + "px";
                        })
                        .style("font-weight", 900)
                        .style("opacity", 1e-6)
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
                text.style("font-family", function(d) {
                    return d.font;
                })
                        .style("fill", function(d) {
                            return fill(d.text.toLowerCase());
                        })
                        .text(function(d) {
                            return d.text;
                        });

                vis.transition().attr("transform", "translate(" + [w >>> 1, h >>> 1] + ")scale(" + scale + ")");
            }

            function update() {
                layout.font('Lato').spiral('archimedean');
                fontSize = d3.scale.sqrt().range([10, 80]).domain([1, 500]);
                if (tags.length > 20){
                    fontSize.domain([+tags[tags.length - 20].value || 1, +tags[0].count*intScale]);
                } else if (tags.length > 10){
                    fontSize.domain([+tags[tags.length - 8].value || 1, +tags[0].count*intScale]);
                } else if (tags.length > 5){
                    fontSize.domain([+tags[tags.length - 4].value || 1, +tags[0].count*intScale]);
                } else if (tags.length){
                    fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].count*intScale]);
                }
                layout.stop().words(tags).start();
            }
        }





    });

    loadTweets.fail(function(data) {
        console.log("Tweet Retrieval Error");
    });
    loadTweets.always(function(data) {
        console.log("From the AJAX Request");
    });


});