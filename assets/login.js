firebase.auth().onAuthStateChanged((user) => {
    if (user) {
    let uid = user.uid
    console.log(uid)
    firebase.database().ref(`/users`).once("child_added")
    .then((userInfo) =>{
      console.log(userInfo.val())
    if(userInfo.val()[uid] == undefined){
      console.log("user")
      window.location = "home.html"
    }
    else{
      console.log("rest")
      window.location = "dashboard.html"
    }
    })
    } 
  });

const login = () => {
    let signBtn = document.getElementById("signupBtn")
    let loader = document.getElementById("loader")
    let email = document.getElementById("email")
    let passward = document.getElementById("passward")
    let regForMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    console.log(signBtn , loader , email.value , passward.value)
  
    signBtn.style.display = "none"
    loader.style.display = "block"
    let lagInBtn = document.getElementById("lagInBtn")
    if (!regForMail.test(email.value)) {
      email.classList.add("Validiation")
      email.classList.remove("myInput")
      email.placeholder = "The Name Is Not Valid"
      email.focus()
      signBtn.style.display = "block"
      loader.style.display = "none"
    }
    else if (passward.value <= 6) {
      passward.classList.add("Validiation")
      passward.classList.remove("myInput")
      passward.placeholder = "The Passward Is Not Valid"
      passward.focus()
      signBtn.style.display = "block"
      loader.style.display = "none"
    }
    else {
      firebase.auth().signInWithEmailAndPassword(email.value, passward.value)
        .then((res) => {
          var user = res.user;
          var errorDiv = document.getElementById("errorDiv")
          errorDiv.style.color = 'green'
          errorDiv.innerText = "You Are Successfully Signed In"
          signBtn.style.display = "block"
          loader.style.display = "none"
          setTimeout(() => {
            // window.location = "../index.html"
          }, 1000)
          localStorage.setItem("uid", user.uid)
            
        })
        .catch((error) => {
          var errorMessage = error.message;
          var errorDiv = document.getElementById("errorDiv")
          errorDiv.innerText = errorMessage
          errorDiv.style.color = "red"
          console.log(errorMessage)
          signBtn.style.display = "block"
          loader.style.display = "none"
        });
    }
  }