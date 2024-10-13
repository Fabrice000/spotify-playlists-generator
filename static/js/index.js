const beginContainer = document.querySelector(".begin-container");
const beginBtn = document.getElementById("begin-btn");
const idBtn = document.getElementById('id-btn');
let isModalShowing = false;
function showErrorPopup(message) {
  Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
  });
}

const is_not_valid = function(client_id,client_secret){
fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
.then(r => {
  if (r.ok){
    return false
  }else{
    return true
  }
})
}
const verify = function(client_id,client_secret){
  if ((client_id == undefined || client_secret == undefined) || (client_id == "" || client_secret =="") || (is_not_valid(client_id,client_secret))){
    return true
  }
  else{
    return false
  }

}
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
    let id = localStorage.getItem("client_id");
    let secret = localStorage.getItem("client_secret");
    if(verify(id,secret)){
      alert("Please enter a valid client Id and a valid client Secret")
      let id = prompt("Enter the client ID:")
      let secret = prompt("Enter the client SECRET:")
      localStorage.setItem("client_id",id)
      localStorage.setItem("client_secret",secret)
    }
    try{
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
      showErrorPopup(error)
    });
  }
  catch(e){
    console.log("i am in catch")
    alert("Please enter a valid client Id and a valid client Secret");
    console.log(e)
  }
  finally{
    let id = prompt("Enter the client ID:")
    let secret = prompt("Enter the client SECRET:")
    localStorage.setItem("client_id",id)
    localStorage.setItem("client_secret",secret)
  }
      
});

