var client_id = '6564545';
var client_secret = '54548';

fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
.then(r => {
    if ("error" in r.json()){
    console.log(true)
console.log(r.json())
  }else{
    console.log(false)
console.log(r.json())
  } 
})
