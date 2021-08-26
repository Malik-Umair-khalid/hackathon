
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

console.log(window.location.hash)
let abc = window.location.hash
let uid = abc.slice(1)
console.log(uid)

firebase.database().ref(`users/dishes/${uid}`).on("child_added" , (res) =>{
    // alert("hellp")
    let foodDetails = res.val();
    console.log(res.key)
    document.getElementById("doit").innerHTML +=
    `
    <div class="card" id="card">
    </hr>
    <img class="card-img-top" src="${foodDetails.foodImagE}" alt="" id="image">
    </hr>
    <div id = '' class="card-body blak">
        <h4 class="card-title fst-italic fw-bold" id="name">${foodDetails.foodName}</h4>
        <p class="card-text" id="price">Catagory:  ${foodDetails.foodCatagory}</p>
        <p class="card-text" id="price"> Price:  ${foodDetails.foodPrice}</p>
        <p class="card-text" id="price">Delevery Type:  ${foodDetails.deleveryType}</p>
        <select id="quantity">
        <option value = "1">1</option>
        <option value = "2">2</option>
        <option value = "3">3</option>
        <option value = "4">4</option>
        <option value = "5">5</option>
        </select>
        <button onclick = "buy('${res.key}' ,'${uid}')" class = "btn btn-primary">Buy</button>
    </div>
    </div>
    ` 
})

function buy (dish, userkey){
    let quantity = document.getElementById("quantity")
    console.log(dish)
    console.log(userkey)
    firebase.auth().onAuthStateChanged((user) => {
        let userId = user.uid
        firebase.database().ref(`pendings/${user.uid}`)
        .push({
            dishId: dish,
            userInfo: userId,
            status: "pending",
            quantity: quantity.value,
            restaurantId: uid
        })
        .then(() =>{
            swal("Good Job!", "Image Added Successfully!", "success");   
            console.log("ADDED")
        }) 
    }) 
}
let logout = () =>{
    firebase.auth().signOut()
    .then(() =>{
        document.getElementById("headerSignBtn").style.display = "block"
        document.getElementById("headerLoginBtn").style.display = "block"
        document.getElementById("logout").style.display = "none"
        window.location = "Login.html"
    })
}
