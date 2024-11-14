const beginContainer = document.querySelector(".begin-container");
const beginBtn = document.getElementById("begin-btn");
const idBtn = document.getElementById('id-btn');
let isModalShowing = false;
beginBtn.addEventListener("click", () => {
    isModalShowing = !isModalShowing;
  
    if (isModalShowing) {
      beginBtn.textContent = "Hide Instructions";
      beginContainer.style.display = "block";
    } else {
      beginBtn.textContent = "Show Instructions";
      beginContainer.style.display = "none";
    }
  });
idBtn.addEventListener("click", () => {
  let id = localStorage.getItem('client_id');
  let secret = localStorage.getItem('client_secret');
  if ((!id||!secret)){
    let id ="";
    let secret="";
    while (id==="" || secret==="") {
    alert("Please enter a valid information")
    id = prompt("Enter the client Id");
    secret = prompt("Enter the client secret");
    }
    localStorage.setItem('client_id',id);
    localStorage.setItem('client_secret',secret)
    console.log("Client information is in local locale storage")
    fetch("/process-client-data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value  // Récupère le token CSRF du template
      },
      body: new URLSearchParams({
        'client_id': id,
        'client_secret': secret
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);  // Affiche le message de succès dans la console
    })
    .catch(error => {
      console.error("Error:", error);  // Affiche une erreur en cas de problème
    });  
  }else{
    console.log(id);
    console.log(secret);
    fetch("/process-client-data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value  // Récupère le token CSRF du template
      },
      body: new URLSearchParams({
        'client_id': id,
        'client_secret': secret
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);  // Affiche le message de succès dans la console
    })
    .catch(error => {
      console.error("Error:", error);  // Affiche une erreur en cas de problème
    });  
  }
});
