var allMediaDict = {};
var mediaDescriptionDict = {};
var monthNames = ["一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月"];
var dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

var origin_yr = 2015;
var origin_mn = 0;
var origin_dy = 12;

var terminate_yr = 2015;
var terminate_mn = 3;
var terminate_dy = 6;

var dayNum = daydiff(transferDate(origin_yr, origin_mn, origin_dy), transferDate(terminate_yr, terminate_mn, terminate_dy)) + 1;
// console.log(dayNum);
var w = 100/dayNum;

var yr = origin_yr;
var mn = origin_mn;
var dy = origin_dy;
var daysInMonthNow = getdaysInMonth(origin_mn + 1, origin_yr);
var mediaName = "";

var toBotCount = 0;

var query = window.location.search;
// Skip the leading ?, which should always be there, 
// but be careful anyway
if (query.substring(0, 1) == '?') {
  mediaName = query.substring(1);
}

else
	mediaName = "udn";

// console.log(mediaName);

$(".title").text(getMediaNameStr(mediaName));

d3.csv("data/media.csv", function(description_data){
	for(var i = 0; i < description_data.length; i++){
		mediaDescriptionDict[description_data[i]["mediaName"]] = description_data[i]["Description"];
	}
	// console.log(mediaDescriptionDict);
	$(".text-content").html(mediaDescriptionDict[mediaName]);
});



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

	var feb_left = ((91*20)/dayNum ) + "%";

	var feb_line_block = d3.select(".row")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "feb-line-block")
							.style("left", feb_left);
	
	feb_line_block.append("div").attr("class", "vertical-line");
	feb_line_block.append("div").attr("class", "vertical-label").text("2015.2.1");	

	var mar_left = ((91*48)/dayNum ) + "%";

	var mar_line_block = d3.select(".row")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "mar-line-block")
							.style("left", mar_left);
	
	mar_line_block.append("div").attr("class", "vertical-line");
	mar_line_block.append("div").attr("class", "vertical-label").text("2015.3.1");

	var apr_left = ((91*79)/dayNum + 0.1) + "%";

	var apr_line_block = d3.select(".row")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "apr-line-block")
							.style("left", apr_left);
	
	apr_line_block.append("div").attr("class", "vertical-line");
	apr_line_block.append("div").attr("class", "vertical-label").text("2015.4.1");

	d3.select(".row")
	.append("div")
	.attr("class", "vertical-line-block")
	.attr("id", "percent-label")
	.text("封鎖百分比");

	$(".bar-o").on("mouseover", function () {
	    //stuff to do on mouseover
	    var this_id = $(this).attr("id");
	    $("#" + this_id + "-tip").css("display", "table");
	    $(this).attr("class", "bar-o hover");

	    var date_seperate = $(this).attr("id").split("-");

	    ga("send", {
          "hitType": "event",
          "eventCategory": "subpage-bar",
          "eventAction": "mousehover",
          "eventLabel": date_seperate[0]
        });
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
		// console.log(monthDict);
	}



	for (var i in Object.keys(monthDict)){

		var mn_now = parseInt(Object.keys(monthDict)[i].split("-")[1]) + 1;
		var yr_now = Object.keys(monthDict)[i].split("-")[0];

		/*d3.select("#calendar-container")
		.append("a")
		.attr("name", "day-" + yr_now + "-" + mn_now);

		d3.select("#calendar-container")
		.append("div")
		.attr("class", "month")
		.attr("id", "day-" + yr_now + "-" + mn_now);*/

		d3.select("#day-" + yr_now + "-" + mn_now)
		.append("div")
		.attr("class", "month-name")
		.text(monthNames[mn_now - 1]);

		var day_row_block = d3.select("#day-" + yr_now + "-" + mn_now).append("div").attr("class", "day-row-block");

		for (var j = 0; j < 7; j++){
			day_row_block.append("div").attr("class", "day-row").text(dayNames[j]);
		}

		var date = new Date(mn_now + "/1/" + yr_now);
		// console.log(date);
		var n = date.getDay();

		for(var k = 0; k < n; k++){
			d3.select("#day-" + yr_now + "-" + mn_now)
			.append("div")
			.attr("class", "image");
		}

		var daysBegin = 1;
		if(mn_now == (origin_mn + 1)) daysBegin = origin_dy;
		var daysEnd = getdaysInMonth( mn_now, yr_now );
		if(mn_now == (terminate_mn + 1)) daysEnd = terminate_dy;

		for(var j = daysBegin; j <= daysEnd; j++ ){

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
			.attr("src", "//p.udn.com.tw/upf/newmedia/2015_data/20150318_firewall_pics/" + mediaName + "_small/" + mediaName + "_" + mn_pic + dy_pic + "_small.png")
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
    	// $(this).parent().attr("class", "image future");  
    	// console.log($(this));
    	$(this).attr("src", "img/nopic.jpg")
    			.attr("id", "no-pic");  
    });

    $(".bar-o").click( function () {
    	var m = parseInt($(this).attr("id").split("-")[3]) + 1;
    	var s = $(this).attr("id").split("-")[1] + "-" + $(this).attr("id").split("-")[2] + "-" + m;
	   	$('html, body').animate({
			scrollTop: ($("#" + s).offset().top)
		}, 800);

		ga("send", {
          "hitType": "event",
          "eventCategory": "subpage-bar",
          "eventAction": "mouseclick",
          "eventLabel": $(this).attr("id").split("-")[0]
        });
	});

	/*$(".image").click(function(){

		var this_id = $(this).attr("id");
		// console.log(this_id);

		var yr_now = parseInt(this_id.split("-")[0]);
		var mn_now = parseInt(this_id.split("-")[1]);
		var dy_now = parseInt(this_id.split("-")[2]);

		var days_inMon = getdaysInMonth(mn_now,yr_now);
		var dd_left = "";
		var dd_right = "";

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

		if(mn_now == (origin_mn + 1) && dy_now == origin_dy)
			$("#left-nav-label").css("display", "none");
		else
			$("#left-nav-label").css("display", "block");

		if(mn_now == (terminate_mn + 1) && dy_now == terminate_dy)
			$("#right-nav-label").css("display", "none");
		else
			$("#right-nav-label").css("display", "block");

		var display_str = yr_now + "." + mn_now + "." + dy_now + '&nbsp;&nbsp; <span class = "text-' + type + '">' + getTipTypeStr(type) + '</span>'  ;
		$(".detail-title").html(display_str);

		if(dy_now - 1 < 1){
			dd_left = yr_now + "." + (mn_now - 1) + "." + getdaysInMonth(mn_now-1, yr_now);
		}
		else{
			dd_left = yr_now + "." + mn_now + "." + (dy_now - 1);
		}
		
		$("#left-nav-label").text(dd_left);

		if(dy_now + 1 > days_inMon){
			dd_right = yr_now + "." + (mn_now + 1) + ".1" ;
		}
		else{
			dd_right = yr_now + "." + mn_now + "." + (dy_now + 1);
		}

		$("#right-nav-label").text(dd_right);

		var image_src = "";
		if($(this).children()[0].id == "no-pic"){
			image_src = "img/nopic.jpg"
		}

		else{
			image_src = "//p.udn.com.tw/upf/newmedia/2015_data/20150318_firewall_pics/" + mediaName + "/" + mediaName + "_" + mn_pic + dy_pic + ".png";
		}

		d3.select(".detail-image")
		.append("img")
		.attr("src", image_src)
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

	$(".page-overlay").on("click",function(event){
		if(event.target.id == "page-cover" || event.target.id == "right-nav-overlay" || event.target.id == "left-nav-overlay"){
			$(".detail-title").empty();
			$(".detail-image").empty();
			$(".page-overlay").css("display", "none");
		}
		// console.log(event.target);
	});*/

	$(".go-top-img").click(function(){
		$('html, body').animate({scrollTop:0}, 800);
		ga("send", {
          "hitType": "event",
          "eventCategory": "subpage-gotop",
          "eventAction": "mouseclick",
          "eventLabel": "go-top-btn"
        });
	});

	$("#go-back").click(function(){

		ga("send", {
          "hitType": "event",
          "eventCategory": "subpage-goback",
          "eventAction": "mouseclick",
          "eventLabel": "go-back-btn"
        });
	});

	$(window).on("scroll", function(){
		if ( $(window).scrollTop() >= $("#calendar-container").offset().top ){
			$(".go-top-img").fadeIn();
		}
		else{
			$(".go-top-img").fadeOut();
		}

		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        	// you're at the bottom of the page
        	
        	if(toBotCount == 0){
        		// console.log("bot is here");
        		toBotCount = 1;
        		ga("send", {
		          "hitType": "event",
		          "eventCategory": "subpage-scrolling",
		          "eventAction": "windowscroll",
		          "eventLabel": "scroll-to-bottom"
		        });
        	}

    	}
	});

	/*$(".nav-label").click(function(){
		this_text = $(this).text();

		var yr_now = parseInt(this_text.split(".")[0]);
		var mn_now = parseInt(this_text.split(".")[1]);
		var dy_now = parseInt(this_text.split(".")[2]);


		var days_inMon = getdaysInMonth(mn_now,yr_now);
		var dd_left = "";
		var dd_right = "";

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

		if(mn_now == (origin_mn + 1) && dy_now == origin_dy)
			$("#left-nav-label").css("display", "none");
		else
			$("#left-nav-label").css("display", "block");

		if(mn_now == (terminate_mn + 1) && dy_now == terminate_dy)
			$("#right-nav-label").css("display", "none");
		else
			$("#right-nav-label").css("display", "block");

		var display_str = yr_now + "." + mn_now + "." + dy_now + '&nbsp;&nbsp; <span class = "text-' + type + '">' + getTipTypeStr(type) + '</span>'  ;
		$(".detail-title").html(display_str);

		if(dy_now - 1 < 1){
			dd_left = yr_now + "." + (mn_now - 1) + "." + getdaysInMonth(mn_now-1, yr_now);
		}
		else{
			dd_left = yr_now + "." + mn_now + "." + (dy_now - 1);
		}
		
		$("#left-nav-label").text(dd_left);

		if(dy_now + 1 > days_inMon){
			dd_right = yr_now + "." + (mn_now + 1) + ".1" ;
		}
		else{
			dd_right = yr_now + "." + mn_now + "." + (dy_now + 1);
		}

		$("#right-nav-label").text(dd_right);

		var image_src = "";
		var image_date_id = yr_now + "-" + mn_now + "-" + dy_now;
		if($("#" + image_date_id).children()[0].id == "no-pic"){
			image_src = "img/nopic.jpg"
		}

		else{
			image_src = "//p.udn.com.tw/upf/newmedia/2015_data/20150318_firewall_pics/" + mediaName + "/" + mediaName + "_" + mn_pic + dy_pic + ".png";
		}

		$(".detail-image img").attr("src", image_src);
		$(".detail-image div").attr("class", "detail-image-cover " + type );

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
            return "nextmag";
        case 15:
            return "bsweekly";
    }
}

function getMediaNameStr(str){
	switch(str){
		case "udn":
			return "聯合新聞網";
		case "appledaily":
			return "蘋果日報";
		case "ltn":
			return "自由時報";
		case "chinatimes":
			return "中時電子報";
		case "cna":
			return "中央社";
		case "yahoo":
			return "Yahoo奇摩新聞";
		case "ettoday":
			return "東森新聞雲";
		case "nownews":
			return "Nownews";
		case "setn":
			return "三立新聞網";
		case "tvbs":
			return "TVBS";
		case "stormmedia":
			return "風傳媒";
		case "newtalk":
			return "新頭殼";
		case "newslens":
			return "關鍵評論網";
		case "pnn":
			return "公視新聞議題中心";
		case "nextmag":
			return "台灣壹週刊";
		case "bsweekly":
			return "商業週刊";
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
