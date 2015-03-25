var allMediaDict = {}
var monthNames = ["一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月"];
var dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

var origin_yr = 2015;
var origin_mn = 0;
var origin_dy = 12;

var dayNum = daydiff(transferDate(origin_yr, origin_mn, origin_dy), nowDate());
// console.log(dayNum);
var w = 100/dayNum;

var yr = origin_yr;
var mn = origin_mn;
var dy = origin_dy;
var daysInMonthNow = getdaysInMonth(origin_mn + 1, origin_yr);
var mediaName = "udn";

d3.json("data/allMediaDayType.json", function (dataset) {

	allMediaDict = dataset;
	var blocked_num = 0;
	var all_detect = 0;

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
		// var date_for_tip = "day-" + yr.toString() + "-" + (mn+1).toString() + "-" + dy.toString();
		var type;
		// console.log(date);

		if (date in allMediaDict[mediaName]){
			type = allMediaDict[mediaName][date];
			// console.log(type);
			if (type == "verdict-5") blocked_num += 1;
			if (type != "verdict-1") all_detect += 1;
		}

		else{
			type = "no-data";
		}

		var date_for_tip = yr.toString() + "." + (mn+1).toString() + "." + dy.toString() + ' <span class = "text-' + type + '">' + getTipTypeStr(type) + '</span>'  ;

		var create_bar_o = d3.select(".row")
							.append("div")
							.attr("class", "bar-o")
							.attr("id", mediaName + '-' + date)
							.attr("onclick", "location.href='" + mediaName + "_page.php#day-" + yr.toString() + "-" + (mn+1).toString() + "'")
							.style({
								"width": w.toString() + "%"
							});
		create_bar_o.append("div")
		.attr("class", "bar " + type)
		.style("height", "6px");

		create_bar_o.append("div")
		.attr("class", "tooltip")
		.attr("id", mediaName + '-' + date + "-tip")
		.html(date_for_tip)
		.style("width", getTipWidth(type))
		.style("left", "-" + parseInt(getTipWidth(type))/2 + "px");

		/*if(i == 1){
			d3.select("." + mediaName)
			.append("div")
			.attr("class", "background-line");
		}*/

		dy += 1;
	}

	if(all_detect == 0) all_detect = 1;
	$(".row-percent").text(Math.round((blocked_num/all_detect)*100) + "%");

	var start_line_block = d3.select(".row")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "start-line-block")
							.style("left", "0%");

	start_line_block.append("div").attr("class", "vertical-line");
	start_line_block.append("div").attr("class", "vertical-label").text("2015.1.12");

	var feb_left = ((93*20)/dayNum ) + "%";

	var feb_line_block = d3.select(".row")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "feb-line-block")
							.style("left", feb_left);
	
	feb_line_block.append("div").attr("class", "vertical-line");
	feb_line_block.append("div").attr("class", "vertical-label").text("2015.2.1");	

	var mar_left = ((93*48)/dayNum - 0.1) + "%";

	var mar_line_block = d3.select(".row")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "mar-line-block")
							.style("left", mar_left);
	
	mar_line_block.append("div").attr("class", "vertical-line");
	mar_line_block.append("div").attr("class", "vertical-label").text("2015.3.1");

	$(".bar-o").on("mouseover", function () {
	    //stuff to do on mouseover
	    var this_id = $(this).attr("id");
	    $("#" + this_id + "-tip").css("display", "table");
	    $(this).attr("class", "bar-o hover");
	});

	$(".bar-o").on("mouseleave", function () {
	    //stuff to do on mouseover
	    var this_id = $(this).attr("id");
	    $("#" + this_id + "-tip").css("display", "none");
	    $(this).attr("class", "bar-o");
	});

	var allKeys = Object.keys(allMediaDict[mediaName]);
	var monthDict = {};

	for(var o in allKeys){
		if(allKeys[o].split("-")[0] != "day"){
			continue;
		}
		else if(parseInt(allKeys[o].split("-")[1]) < 2015){
			continue;
		}
		else if(allKeys[o].split("-")[1] + "-" + allKeys[o].split("-")[2] in monthDict){
			continue;
		}
		else{
			monthDict[allKeys[o].split("-")[1] + "-" + allKeys[o].split("-")[2]] = 1;
		}
		console.log(monthDict);
	}

	for (var i in Object.keys(monthDict)){

		var mn_now = parseInt(Object.keys(monthDict)[i].split("-")[1]) + 1;
		var yr_now = Object.keys(monthDict)[i].split("-")[0];

		d3.select("#calendar-container")
		.append("a")
		.attr("name", "day-" + yr_now + "-" + mn_now);

		d3.select("#calendar-container")
		.append("div")
		.attr("class", "month")
		.attr("id", "day-" + yr_now + "-" + mn_now);

		d3.select("#day-" + yr_now + "-" + mn_now)
		.append("div")
		.attr("class", "month-name")
		.text(monthNames[mn_now - 1]);

		var day_row_block = d3.select("#day-" + yr_now + "-" + mn_now).append("div").attr("class", "day-row-block");

		for (var j = 0; j < 7; j++){
			day_row_block.append("div").attr("class", "day-row").text(dayNames[j]);
		}

		var date = new Date(mn_now + "/1/" + yr_now);
		console.log(date);
		var n = date.getDay();

		for(var k = 0; k < n; k++){
			d3.select("#day-" + yr_now + "-" + mn_now)
			.append("div")
			.attr("class", "image");
		}

		var daysBegin = 1;
		if(mn_now == 1) daysBegin = 12;

		for(var j = daysBegin; j <= getdaysInMonth( mn_now, yr_now ); j++ ){

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

			var dd = "day-" + yr_now + "-" + (mn_now - 1) + "-" + j;
			// console.log(dd);
			var type;

			if (dd in allMediaDict[mediaName]){
				type = allMediaDict[mediaName][dd];
				// console.log(type);
			}

			else{
				type = "no-data";
			}
			// console.log(type);


			var image_block = d3.select("#day-" + yr_now + "-" + mn_now)
								.append("div")
								.attr("class", "image")
								.attr("id", yr_now + "-" + mn_now + "-" + j);

			image_block.append("img")
			.attr("src", "//p.udn.com.tw/upf/newmedia/2015_data/20150318_firewall_pics/" + mediaName + "/" + mediaName + "_" + mn_pic + dy_pic + ".png")
			.attr("width", "100%");
			
			image_block.append("div")
			.attr("class", "cover " + type);

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

    $(".bar-o").click( function () {
    	var m = parseInt($(this).attr("id").split("-")[3]) + 1;
    	var s = $(this).attr("id").split("-")[1] + "-" + $(this).attr("id").split("-")[2] + "-" + m;
	   	$('html, body').animate({
			scrollTop: ($("#" + s).offset().top)
		}, 800);
	});

	$(".image").click(function(){

		var this_id = $(this).attr("id");
		

		var yr_now = parseInt(this_id.split("-")[0]);
		var mn_now = parseInt(this_id.split("-")[1]);
		var dy_now = parseInt(this_id.split("-")[2]);



		var mn_pic;
		var dy_pic;

		if(mn_now < 10) 
			mn_pic = "0" + mn_now.toString();
		else 
			mn_pic = mn_now.toString();

		if(dy_now < 10)
			dy_pic = "0" + dy_now.toString();
		else
			dy_pic = dy_now.toString();

		var dd = "day-" + yr_now + "-" + (mn_now - 1) + "-" + dy_now;
		// console.log(dd);
		var type;

		if (dd in allMediaDict[mediaName]){
			type = allMediaDict[mediaName][dd];
			// console.log(type);
		}

		else{
			type = "no-data";
		}

		var display_str = yr_now + "." + mn_now + "." + dy_now + '&nbsp;&nbsp; <span class = "text-' + type + '">' + getTipTypeStr(type) + '</span>'  ;
		$(".detail-title").html(display_str);

		d3.select(".detail-image")
		.append("img")
		.attr("src", "//p.udn.com.tw/upf/newmedia/2015_data/20150318_firewall_pics/" + mediaName + "/" + mediaName + "_" + mn_pic + dy_pic + ".png")
		.attr("width", "100%");

		d3.select(".detail-image")
		.append("div")
		.attr("class", "detail-image-cover " + type);
		
		$(".page-overlay").css("display", "block");
	});

	$(".close").click(function(){
		$(".detail-title").empty();
		$(".detail-image").empty();
		$(".page-overlay").css("display", "none");
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

function getTipTypeStr(str){
	switch(str){
		case "verdict-1":
			return "無法確定";
		case "verdict-2":
			return "正常連線";
		case "verdict-3":
			return "部分封鎖";
		case "verdict-5":
			return "封鎖";
		case "no-data":
			return "無資料";
	}
}

function getTipWidth(str){
	switch(str){
		case "verdict-1":
			return "140px";
		case "verdict-2":
			return "140px";
		case "verdict-3":
			return "140px";
		case "verdict-5":
			return "108px";
		case "no-data":
			return "124px";
	}
}

function nowDate(){
	return new Date();
}

function transferDate(year, month, day) {
    return new Date(year, month, day);
}

function daydiff(first, second) {
    return (second-first)/(1000*60*60*24);
}
