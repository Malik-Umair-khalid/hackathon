firebase.auth().onAuthStateChanged((user) => {
    if (user) {
    document.getElementById("headerSignBtn").style.display = "none"
    document.getElementById("headerLoginBtn").style.display = "none"
    document.getElementById("logout").style.display = "block"
    let uid = user.uid
    firebase.database().ref(`/users`).once("child_added")
    .then((userInfo) =>{
      console.log(userInfo.val())
    if(userInfo.val()[uid] == undefined){
      console.log("user")
    }
    else{
      console.log("rest")
      window.location = "dashboard.html"
    }
    })
    }
    else{
        window.location = "Login.html"
    }
  });
  let logout = () =>{
    firebase.auth().signOut()
    .then(() =>{
        document.getElementById("headerSignBtn").style.display = "block"
        document.getElementById("headerLoginBtn").style.display = "block"
        document.getElementById("logout").style.display = "none"
    })
  }

  firebase.database().ref(`users/restaurants`).on("child_added", (detail) =>{
    let restCard = detail.val()
    console.log(detail.key)
    console.log(restCard.profileImage)
    document.getElementById("doit").innerHTML +=
    `
    <div class="card" id="card">
    <img class="card-img-top" src="${restCard.profileImage}" alt="" id="image">
    <div id = '${detail.key}' class="card-body blak">
        <h4 class="card-title fw-bold text-uppercase fst-italic" id="name">${restCard.name}</h4>
        <button onclick="dishes('${detail.key}')" class="btn btn-outline-success">View</button>
    </div>
    </div>
    ` 

  })

  function dishes(id){
      console.log(id)
      window.location = "dishes.html#" + id
  }