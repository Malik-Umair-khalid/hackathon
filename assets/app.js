

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
  let uid = user.uid
  console.log(uid)
  firebase.database().ref(`/users`).once("child_added")
  .then((userInfo) =>{
    console.log(userInfo.val()[uid])
  if(userInfo.val()[uid] == undefined){
    window.location = "assets/home.html"
  }
  else{
    window.location = "assets/dashboard.html"
  }
  })
  } 
});




