
function makechg() {
    var a = document.getElementsByClassName('disap')[0];
    var b = document.getElementsByClassName('disap')[1];
    var c = document.getElementsByClassName('table')[0];
alert("YOUR REPORT HAS BEEN SUBMITTED SUCCESFULLY");
    a.style.display = 'none';
    b.style.display = 'none';
    c.style.display = 'block';
    var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
document.getElementById("type").innerHTML=dateTime;
}