var allMediaDict = {}

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
var sortPercentArray = [];

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

		var mediaName = sortPercentArray[mediaIdx]["mediaName"];
		yr = origin_yr;
		mn = origin_mn;
		dy = origin_dy;

		var row_contain = d3.select(".image-container")
							.append("div")
							.attr("class", "row-container")
							.attr("id", "row-container-" + mediaName);

		row_contain.append("div").attr("class", "row-medianame").text(getMediaNameStr(mediaName));

		row_contain.append("div").attr("class", "row " + mediaName);

		row_contain.append("div").attr("class", "row-percent").attr("id", "percent-" + mediaName);

		var percent_length = allMediaDict[mediaName]["percent"].length;
		$("#percent-" + mediaName).text(allMediaDict[mediaName]["percent"].substr(0, percent_length - 9));

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

			var date_for_tip = yr.toString() + "." + (mn+1).toString() + "." + dy.toString() + ' <span class = "tip-' + type + '">' + getTipTypeStr(type) + '</span>'  ;

			var create_bar_o = d3.select("." + mediaName)
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
	}

	var start_line_block = d3.select(".image-container")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "start-line-block")
							.style("left", "14%");

	start_line_block.append("div").attr("class", "vertical-line");
	start_line_block.append("div").attr("class", "vertical-label").text("2015.1.12");

	var feb_left = ((74*20)/dayNum + 14.2) + "%";

	var feb_line_block = d3.select(".image-container")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "feb-line-block")
							.style("left", feb_left);
	
	feb_line_block.append("div").attr("class", "vertical-line");
	feb_line_block.append("div").attr("class", "vertical-label").text("2015.2.1");	

	var mar_left = ((74*48)/dayNum + 14.4) + "%";

	var mar_line_block = d3.select(".image-container")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "mar-line-block")
							.style("left", mar_left);
	
	mar_line_block.append("div").attr("class", "vertical-line");
	mar_line_block.append("div").attr("class", "vertical-label").text("2015.3.1");

	var end_line_block = d3.select(".image-container")
							.append("div")
							.attr("class", "vertical-line-block")
							.attr("id", "end-line-block")
							.style("left", "88%");

	end_line_block.append("div").attr("class", "vertical-line");
	end_line_block.append("div").attr("class", "vertical-label").text("end");

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
		case "cw":
			return "天下雜誌獨立評論";
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
			return "沒有被封鎖";
		case "verdict-3":
			return "有時被封鎖";
		case "verdict-5":
			return "被封鎖";
		case "no-data":
			return "無資料";
	}
}

function getTipWidth(str){
	switch(str){
		case "verdict-1":
			return "108px";
		case "verdict-2":
			return "120px";
		case "verdict-3":
			return "120px";
		case "verdict-5":
			return "96px";
		case "no-data":
			return "96px";
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
