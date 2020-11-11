function validate() {
    var x = document.getElementsByName('appointment')[0].value;
    var table = document.getElementsByClassName('table')[0];
    var date = document.getElementById('appointmenttime').value;
    var time = document.getElementsByClassName('time')[0];
    var b= document.getElementById('button');
    var h= document.getElementById('header');
    time.style.display = 'none';
    table.style.display = 'block';
    b.style.display = 'none';
    h.style.display = 'none';
    if (x == 1) {
        alert("YOU HAVE SELECTED APPOINTMENT FOR PRESENTATION AT TIME  " + date);

    } else  {
        alert("YOU HAVE SELECTED APPOINTMENT FOR DOUBT CLARIRFICATION AT TIME  " + date);
    }
   
}