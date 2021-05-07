function validate() {
    var table = document.getElementsByClassName('table')[0];
    var date = document.getElementById('appointmenttime').value;
    var time = document.getElementsByClassName('time')[0];
    var b = document.getElementById('button');
    var h = document.getElementById('header');
    var t1=document.getElementById('type1');
    var t2=document.getElementById('type2');
    time.style.display = 'none';
    table.style.display = 'block';
    b.style.display = 'none';
    h.style.display = 'none';
    if (document.getElementById('appointment1').checked) {
        alert("YOU HAVE SELECTED APPOINTMENT FOR PRESENTATION AT TIME  " + date);
        t2.innerHTML=date;
    }
     else {
        alert("YOU HAVE SELECTED APPOINTMENT FOR DOUBT CLARIRFICATION AT TIME  " + date);
        t1.innerHTML="DOUBT CLARIFICATION";
        t2.innerHTML=date;
}
}
