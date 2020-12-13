function validate() {
   var x = document.getElementById('purpose').selectedIndex;
  var y = document.getElementsByTagName("option")[x].value;
  var table = document.getElementsByClassName('table1')[0];
    var date = document.getElementById('setappointment').value;
    var time = document.getElementsByClassName('time')[0];
    var b= document.getElementById('button');
    var h= document.getElementById('header');
    var i= document.getElementById('inst');
    time.style.display = 'block';
    table.style.display = 'block';
    b.style.display = 'none';
    h.style.display = 'block';
    i.style.display = 'none';
    document.getElementById('t').innerHTML=date;
    if (y== 1) {
alert("YOU HAVE SELECTED APPOINTMENT FOR DOUBT CLARIRFICATION AT TIME " + date);
document.getElementById('appo').innerHTML="Doubt Clarification";
}

 else {
alert("YOU HAVE SELECTED APPOINTMENT FOR VIEWING PRESENTATIONS AT TIME " + date);
}
}