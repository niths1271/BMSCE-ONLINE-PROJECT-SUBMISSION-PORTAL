function imager() {
    document.getElementById('background').classList.add('background-image-active');
}
window.onload = setTimeout(imager, 500);




function validatelog() {
    var email = document.forms['log-in-form']['email'];
    var password = document.forms['log-in-form']['password'];
    var flag = 0;
    var email_error = document.getElementById('email_error');
    var password_error = document.getElementById('password_error');
    var result1 = email.value.match('[a-z]+.[a-z][a-z][0-9][0-9]@bmsce.ac.in');
    var result1a = email.value.match('1BM[0-9][0-9][A-Z][A-Z][0-9]{3}');
    if (result1 == email.value || result1a == email.value) {
        email_error.style.display = "none";
        flag = 1;
    } else {
        email_error.style.display = "block";

    }

    var result2 = password.value;
    if (result2.match(/[a-z]/g) && result2.match(/[A-Z]/g) && result2.match(/[0-9]/g) && result2.match(/[^a-zA-Z\d]/g) && result2.length >= 8) {
        password_error.style.display = "none";
        if (flag == 1) {
            flag = 1;
        }

    } else {
        password_error.style.display = "block";

        flag = 0;
    }
    if (flag == 0) {
        return false;
    }
    if (flag == 1) {
        return true;
    }


}