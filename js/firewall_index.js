var allMediaDict = {}

var origin_yr = 2015;
var origin_mn = 0;
var origin_dy = 1;

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

		var row_contain = d3.select(".container")
							.append("div")
							.attr("class", "row-container")
							.attr("id", "row-container-" + mediaName);

		row_contain.append("div").attr("class", "row " + mediaName);

		row_contain.append("div").attr("class", "row-medianame").text(getMediaNameStr(mediaName));

		row_contain.append("div").attr("class", "row-percent").attr("id", "percent-" + mediaName);

		
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
			.attr("onclick", "location.href='" + mediaName + "_page.php#day-" + yr.toString() + "-" + (mn+1).toString() + "'")
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

function nowDate(){
	return new Date();
}

function transferDate(year, month, day) {
    return new Date(year, month, day);
}

function daydiff(first, second) {
    return (second-first)/(1000*60*60*24);
}
