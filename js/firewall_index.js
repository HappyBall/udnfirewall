if( /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // some code..
 window.location.href = "http://p.udn.com.tw/upf/newmedia/2015_data/20150327_udnfirewall/udnfirewall_m/index.html";

}

var allMediaDict = {}

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
var sortPercentArray = [];

var toBotCount = 0;

d3.json("data/allMediaDayType.json", function (dataset) {
	allMediaDict = dataset;
	// console.log(Object.keys(allMediaDict).length);

	for(var i = 0; i < Object.keys(allMediaDict).length; i++){
		var tempDict = {};
		tempDict["mediaName"] = getMediaName(i);
		tempDict["percent"] = parseInt(allMediaDict[getMediaName(i)]["percent"]);
		sortPercentArray.push(tempDict);

	}

	sortPercentArray.sort(function(a, b){return b["percent"] - a["percent"]});

	// console.log(sortPercentArray);


	for(var mediaIdx = 0; mediaIdx < Object.keys(allMediaDict).length; mediaIdx ++){

		var blocked_num = 0;
		var all_detect = 0;
		var daysInMonthNow = getdaysInMonth(origin_mn + 1, origin_yr);

		var mediaName = sortPercentArray[mediaIdx]["mediaName"];
		yr = origin_yr;
		mn = origin_mn;
		dy = origin_dy;

		var row_contain = d3.select(".image-container")
							.append("div")
							.attr("class", "row-container")
							.attr("id", "row-container-" + mediaName);

		var row_medianame_html = "<a class = 'media-link' href = 'subpage.html?" + mediaName + "'>" + getMediaNameStr(mediaName) + "</a>";

		row_contain.append("div").attr("class", "row-medianame").html(row_medianame_html);

		row_contain.append("div").attr("class", "row " + mediaName);

		row_contain.append("div").attr("class", "row-percent").attr("id", "percent-" + mediaName);

		// console.log(daysInMonthNow);

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
				if (type == "verdict-5") blocked_num += 1;
				if (type != "verdict-1") all_detect += 1;
			}

			else{
				type = "no-data";
			}

			var date_for_tip = yr.toString() + "." + (mn+1).toString() + "." + dy.toString() + ' <span class = "text-' + type + '">' + getTipTypeStr(type) + '</span> »'  ;

			var create_bar_o = d3.select("." + mediaName)
								.append("div")
								.attr("class", "bar-o")
								.attr("id", mediaName + '-' + date)
								.attr("onclick", "location.href='subpage.html?" + mediaName + "#day-" + yr.toString() + "-" + (mn+1).toString() + "'")
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

			// console.log(parseInt(getTipWidth(type)));
			/*$("#" + mediaName + '-' + date).simpletip({
				fixed: true,
				position: 'top',
				content: date_for_tip,
				showEffect: "none",
				hideEffect: "none"
				// offset:[-330,-183]
			});*/
			

			dy += 1;
		}

		if(all_detect == 0) $("#percent-" + mediaName).text("----");
		else $("#percent-" + mediaName).text(Math.round((blocked_num/all_detect)*100) + "%");
	}

	var start_line_block = d3.select(".image-container")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "start-line-block")
							.style("left", "15%");

	start_line_block.append("div").attr("class", "vertical-line");
	start_line_block.append("div").attr("class", "vertical-label").text("2015.1.12");

	var feb_left = ((77*20)/dayNum + 15.1) + "%";

	var feb_line_block = d3.select(".image-container")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "feb-line-block")
							.style("left", feb_left);
	
	feb_line_block.append("div").attr("class", "vertical-line");
	feb_line_block.append("div").attr("class", "vertical-label").text("2015.2.1");	

	var mar_left = ((77*48)/dayNum + 15.1) + "%";

	var mar_line_block = d3.select(".image-container")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "mar-line-block")
							.style("left", mar_left);
	
	mar_line_block.append("div").attr("class", "vertical-line");
	mar_line_block.append("div").attr("class", "vertical-label").text("2015.3.1");

	var apr_left = ((77*79)/dayNum + 15.2) + "%";

	var apr_line_block = d3.select(".image-container")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "apr-line-block")
							.style("left", apr_left);
	
	apr_line_block.append("div").attr("class", "vertical-line");
	apr_line_block.append("div").attr("class", "vertical-label").text("2015.4.1");

	d3.select(".image-container")
	.append("div")
	.attr("class", "vertical-line-block")
	.attr("id", "percent-label")
	.text("封鎖百分比");

	$(".bar-o").on("mouseover", function () {
	    //stuff to do on mouseover
	    var this_id = $(this).attr("id");
	    
	    $("#" + this_id + "-tip").css("display", "table");

	    var date_seperate = $(this).attr("id").split("-");
	    var date = date_seperate[1] + "-" + date_seperate[2] + "-" + date_seperate[3] + "-" + date_seperate[4];
	    for(var i = 0; i < Object.keys(allMediaDict).length; i++){
	    	var select = getMediaName(i) + "-" + date;
	    	$("#" + select).attr("class", "bar-o hover");
	    }

	    // console.log(date_seperate[0]);

	    ga("send", {
          "hitType": "event",
          "eventCategory": "mainpage-bar",
          "eventAction": "mousehover",
          "eventLabel": date_seperate[0]
        });
	});

	$(".bar-o").on("mouseleave", function () {
	    //stuff to do on mouseover
	    var this_id = $(this).attr("id");
	    $("#" + this_id + "-tip").css("display", "none");

	    var date_seperate = $(this).attr("id").split("-");
	    var date = date_seperate[1] + "-" + date_seperate[2] + "-" + date_seperate[3] + "-" + date_seperate[4];
	    for(var i = 0; i < Object.keys(allMediaDict).length; i++){
	    	var select = getMediaName(i) + "-" + date;
	    	$("#" + select).attr("class", "bar-o");
	    }
	});

	$(".bar-o").on("click", function () {
		var date_seperate = $(this).attr("id").split("-");
		// console.log(date_seperate[0]);
		ga("send", {
          "hitType": "event",
          "eventCategory": "mainpage-bar",
          "eventAction": "mouseclick",
          "eventLabel": date_seperate[0]
        });

	});

	$(".go-top-img").click(function(){
		$('html, body').animate({scrollTop:0}, 800);
		// $(".go-top-img").fadeOut();
		ga("send", {
          "hitType": "event",
          "eventCategory": "mainpage-gotop",
          "eventAction": "mouseclick",
          "eventLabel": "go-top-btn"
        });
	});

	$(window).on("scroll", function(){
		if ( $(window).scrollTop() >= $(".image-labels-block").offset().top ){
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
		          "eventCategory": "mainpage-scrolling",
		          "eventAction": "windowscroll",
		          "eventLabel": "scroll-to-bottom"
		        });
        	}

    	}
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
			return "商業周刊";
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
			return "155px";
		case "verdict-2":
			return "155px";
		case "verdict-3":
			return "155px";
		case "verdict-5":
			return "123px";
		case "no-data":
			return "139px";
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
