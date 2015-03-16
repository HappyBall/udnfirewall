var allMediaDict = {}

var origin_yr = 2015;
var origin_mn = 0;
var origin_dy = 1;

var dayNum = daydiff(transferDate(origin_yr, origin_mn, origin_dy), transferDate(2015, 2, 11)) + 1;
// console.log(dayNum);
var w = 100/dayNum;

var yr = origin_yr;
var mn = origin_mn;
var dy = origin_dy;
var daysInMonthNow = getdaysInMonth(origin_mn + 1, origin_yr);

d3.json("data/allMediaDayType.json", function (dataset) {
	allMediaDict = dataset;

	var allKeys = Object.keys(allMediaDict["udn"]);
	var monthDict = {};

	for(var o in allKeys){
		if(allKeys[o].split("-")[0] != "day"){
			continue;
		}
		else if(allKeys[o].split("-")[1] + "-" + allKeys[o].split("-")[2] in monthDict){
			continue;
		}
		else{
			monthDict[allKeys[o].split("-")[1] + "-" + allKeys[o].split("-")[2]] = 1;
		}
		// console.log(allKeys[o].split("-")[0]);
	}

	for (var i in Object.keys(monthDict)){
		d3.select("#image-container")
		.append("div")
		.attr("class", "month")
		.attr("id", "day-" + Object.keys(monthDict)[i]);


		for(var j = 0; j < getdaysInMonth( parseInt(Object.keys(monthDict)[i].split("-")[1]) + 1, Object.keys(monthDict)[i].split("-")[0] ); j++ ){
			d3.select("#day-" + Object.keys(monthDict)[i]).append("div");
			console.log(j);
		}
	}


	/*for(var mediaIdx = 0; mediaIdx < 17; mediaIdx ++){

		var mediaName = getMediaName(mediaIdx);
		yr = origin_yr;
		mn = origin_mn;
		dy = origin_dy;

		$("#percent-" + mediaName).text(allMediaDict[mediaName]["percent"]);

		for(var i = 0; i < dayNum; i++){
			if(dy > daysInMonthNow){
				dy = 1;
				mn += 1;
				if(mn > 11){
					mn = 0;
					yr += 1;
				}
				daysInMonthNow = getdaysInMonth(mn + 1, yr);
			}
			var date = "day-" + yr.toString() + "-" + mn.toString() + "-" + dy.toString();
			var date_for_tip = "day-" + yr.toString() + "-" + (mn+1).toString() + "-" + dy.toString();
			var type;
			// console.log(date);

			if (date in allMediaDict[mediaName]){
				type = allMediaDict[mediaName][date];
				// console.log(type);
			}

			else{
				type = "no-data";
			}

			d3.select("." + mediaName)
			.append("div")
			.attr("class", "bar-o")
			.attr("id", mediaName + '-' + date)
			.attr("onclick", "location.href='sites/" + mediaName + "_page.php'")
			.style({
				"width": w.toString() + "%"
			})
			.append("div")
			.attr("class", "bar " + type)
			.style("height", "6px");

			$("#" + mediaName + '-' + date).simpletip({
				fixed: true,
				position: 'top',
				content: date_for_tip,
				showEffect: "none",
				hideEffect: "none"
			});

			dy += 1;
		}
	}

	$(".bar-o").on("mouseover", function () {
	    //stuff to do on mouseover
	    $(this).attr("class", "bar-o hover");
	});

	$(".bar-o").on("mouseleave", function () {
	    //stuff to do on mouseover
	    $(this).attr("class", "bar-o");
	});*/

})



function getdaysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

function getMediaName(idx){
    switch(idx){
        case 0:
            return "udn";
        case 1:
            return "appledaily";
        case 2:
            return "ltn";
        case 3:
            return "chinatimes";
        case 4:
            return "cna";
        case 5:
            return "yahoo";
        case 6:
            return "ettoday";
        case 7:
            return "nownews";
        case 8:
            return "setn";
        case 9:
            return "tvbs";
        case 10:
            return "stormmedia";
        case 11:
            return "newtalk";
        case 12:
            return "newslens";
        case 13:
            return "pnn";
        case 14:
            return "cw";
        case 15:
            return "nextmag";
        case 16:
            return "bsweekly";
    }
}

function transferDate(year, month, day) {
    return new Date(year, month, day);
}

function daydiff(first, second) {
    return (second-first)/(1000*60*60*24);
}
