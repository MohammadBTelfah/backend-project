var registerForm = document.getElementById("registerForm");
var API_URL = "http://localhost:5050/api/createuser";

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    var Name = document.getElementById("fullName").value;
    var Email = document.getElementById("remail").value;
    var Password = document.getElementById("Rpassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (Password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    var Ruser = { Name, Email, Password, confirmPassword };
    console.log(Ruser);
    var response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Ruser),
    });
    var data = await response.json();
    console.log(data);
    if(data.Message === "User created successfully"){
        alert("User created successfully");
        window.location.href = "login.html";
    } else{
        alert("User not created");
    }
    console.log(response);
}); 