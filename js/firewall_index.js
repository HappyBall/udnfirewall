var allMediaDict = {}
var dayNum = 68;
var w = 100/dayNum;
var yr = 2015;
var mn = 0;
var dy = 1;
var daysInMonthNow = getdaysInMonth(mn + 1, yr);

d3.json("data/allMediaDayType.json", function (dataset) {
	allMediaDict = dataset;
	// console.log(allMediaDict);
	for(var mediaIdx = 0; mediaIdx < 17; mediaIdx ++){

		var mediaName = getMediaName(mediaIdx);
		yr = 2015;
		mn = 0;
		dy = 1;

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
			.attr("id", date)
			.style({
				"width": w.toString() + "%"
			})
			.append("div")
			.attr("class", "bar " + type)
			.style("height", "6px");

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
	});

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