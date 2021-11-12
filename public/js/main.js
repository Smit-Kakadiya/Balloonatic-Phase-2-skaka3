function emailValidation(inputText)
{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.value.match(mailformat))
    {
        alert("Email Verified Sucessfully. You are heading towards home page.");
        window.location.href = "/";        
    }
    else
    {
        alert("Email Address is empty or invalid.");
        document.form1.email.focus();
        return false;
    }
}

document.getElementById("currentYear").innerHTML = new Date().getFullYear();

function krista1()
{
    document.getElementById("krista").onclick = function ()
    {
        alert("For other business related queries, please contact me in my another email: kristapatel@gmail.com.")
    };
}
function popular1()
{
    document.getElementById("popular1").style.color = "red";
}

function boy1()
{
    document.getElementById("boy1").style.color = "red";
}

function girl1()
{
    document.getElementById("girl1").style.color = "red";
}

function custom1()
{
    document.getElementById("custom1").style.color = "red";
}

function mystery1()
{
    document.getElementById("mystery1").style.color = "red";
}

$(document).ready(function() {
    $('.patient-quote').flexslider();    
  });
