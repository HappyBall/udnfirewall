var allMediaDict = {}
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

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
var mediaName = "udn";

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

		var mn_now = parseInt(Object.keys(monthDict)[i].split("-")[1]) + 1;
		var yr_now = Object.keys(monthDict)[i].split("-")[0];

		d3.select("#image-container")
		.append("a")
		.attr("name", "day-" + yr_now + "-" + mn_now);

		d3.select("#image-container")
		.append("div")
		.attr("class", "month")
		.attr("id", "day-" + yr_now + "-" + mn_now);

		d3.select("#day-" + yr_now + "-" + mn_now)
		.append("h2")
		.text(monthNames[mn_now - 1]);

		var date = new Date(mn_now + "/1/" + yr_now);
		console.log(date);
		var n = date.getDay();

		for(var k = 0; k < n; k++){
			d3.select("#day-" + yr_now + "-" + mn_now)
			.append("div")
			.attr("class", "image");
		}

		for(var j = 1; j <= getdaysInMonth( mn_now, yr_now ); j++ ){

			var mn_pic;
			var dy_pic;

			if(mn_now < 10) 
				mn_pic = "0" + mn_now.toString();
			else 
				mn_pic = mn_now.toString();

			if(j < 10)
				dy_pic = "0" + j.toString();
			else
				dy_pic = j.toString();


			var image_block = d3.select("#day-" + yr_now + "-" + mn_now)
								.append("div")
								.attr("class", "image")
								.attr("id", yr_now + "-" + mn_now + "-" + j);

			image_block.append("img")
			.attr("src", "//p.udn.com.tw/upf/newmedia/2015_data/20150318_firewall_pics/" + mediaName + "/" + mediaName + "_" + mn_pic + dy_pic + ".png")
			.attr("width", "124px");

			image_block.append("div")
			.attr("class", "day-overlay")
			.text(dy_pic);
			// console.log(j);
		}
	}

	$("img")
	.load(function() { console.log("image loaded correctly"); })
    .error(function() { 
    	$(this).parent().attr("class", "image future");  
    	$(this).remove();  
    });

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
