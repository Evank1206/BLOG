document.getElementById('submitBtn').onclick = async function (e){
    // console.log("log")
    // e.preventDefault();
    let request = {
        "userName": document.getElementById("userName").value,
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value,
        "passwordRepeat": document.getElementById("ConfirmPassword").value
    }
    let response = await axios.post( '/signup',
      request,
      {
        headers: {
            'Content-Type': 'application/json'
        }
      }
    ).catch(function(e){
      console.log('FAILURE!!', e);
    });
    console.log(response.data)
    if (response.data.status === "OK") window.location = "login";
  }