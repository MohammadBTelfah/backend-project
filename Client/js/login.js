var loginForm = document.getElementById("loginForm");
var API_URL = "http://localhost:5050/api/login";
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    var Email = document.getElementById("email").value;
    var Password = document.getElementById("password").value;

    var user = { Email, Password };
    console.log(user);
    var response = await fetch(API_URL,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    }) .then(res => res.json()).then(data=>{
        console.log(data);
        if(data.Message =="User logged in successfully"){
            alert("User logged in successfully");
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("role", data.role);
            window.location.href = "home.html";
        }
        else{
            alert("User not found");
        }
    })
    console.log(response);
});