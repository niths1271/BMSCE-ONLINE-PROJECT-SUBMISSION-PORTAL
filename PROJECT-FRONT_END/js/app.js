function validate() {
    var x = document.getElementsByName('appointment')[0].value;
    var table = document.getElementsByClassName('table')[0];
    var date = document.getElementById('appointmenttime').value;
    var time = document.getElementsByClassName('time')[0];
    var btn = document.getElementsByClassName('btn')[0];
    time.style.display = 'none';
    btn.style.display = 'none';
    table.style.display = 'block';
    if (x == 1) {
        alert("YOU HAVE SELECTED APPOINTMENT FOR PRESENTATION AT TIME " + date);

    } else {
        alert("YOU HAVE SELECTED APPOINTMENT FOR DOUBT CLARIRFICATION AT TIME " + date);

    }
}