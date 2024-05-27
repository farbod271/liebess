const response = await fetch('/csrf-token');
const { token } = await response.json();

document.getElementById('myform').addEventListener('submit', function(event) {
event.preventDefault(); 


const form = event.target;
const formData = new FormData(form);
const captchaResponse = formData.get("g-recaptcha-response")
const csrfToken = token;

fetch(form.action, {
method: form.method,
body: formData,
headers: {
    'X-CSRF-Token': csrfToken
},
params: {
    'g-recaptcha-response': captchaResponse
}
})
.then(response => response.json())
});