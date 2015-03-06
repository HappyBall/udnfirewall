var a = httpGet("https://congressonline.azurewebsites.net/Api/Analysis/Chat?analysisChatCategory=YuanAttendance_Votes");

console.log(a);

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}