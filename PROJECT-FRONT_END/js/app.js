function validate() {
    var table = document.getElementsByClassName('table')[0];
    var date = document.getElementById('appointmenttime').value;
    var time = document.getElementsByClassName('time')[0];
    var b = document.getElementById('button');
    var h = document.getElementById('header');
    var t=document.getElementById('type');
    time.style.display = 'none';
    table.style.display = 'block';
    b.style.display = 'none';
    h.style.display = 'none';
    if (document.getElementById('appointment1').checked) {
        alert("YOU HAVE SELECTED APPOINTMENT FOR PRESENTATION AT TIME  " + date);
    }
     else {
        alert("YOU HAVE SELECTED APPOINTMENT FOR DOUBT CLARIRFICATION AT TIME  " + date);
        t.innerHTML="DOUBT CLARIFICATION";
    }
}