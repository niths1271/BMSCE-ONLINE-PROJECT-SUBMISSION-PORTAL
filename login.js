window.onload = function() {
    const signUpButton = document.getElementById('sign-up-btn');
    const logInButton = document.getElementById('log-in-btn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
    logInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));
}