
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("headerSignBtn").style.display = "none"
        document.getElementById("headerLoginBtn").style.display = "none"
        document.getElementById("logout").style.display = "block"
        firebase.database().ref(`pendings`).on("child_added", (orders) => {
            let restId = orders.key
            console.log(restId)
                firebase.database().ref(`pendings/${restId}`).on("child_added", (orders) => {
                    let dishId = orders.val().dishId;
                    let quantity = orders.val().quantity;
                    let restaurantId = orders.val().restaurantId;
                    let status = orders.val().status;
                    let userId = orders.val().userId;
                    if(status == "pending"){
                    firebase.database().ref(`users/restaurants/${restaurantId}`).on("value", (restDetails) => {
                        restDetails = restDetails.val()
                        firebase.database().ref(`users/dishes/${restaurantId}`).on("child_added", (dishDetails => {
                            dishDetails = dishDetails.val()
                            document.getElementById("pend").innerHTML += `
                            <div class = "border border-1 p-4 mb-2 rounded shadow-lg">
                            <h1>Customer Details </h1>
                            <p>Restaurant Name: ${restDetails.name}</p>
                            <p>Restaurant Email: ${restDetails.email}</p>
                            <p>Restaurant Address: ${restDetails.country, restDetails.city}</p>
                            <div>
                            <h1>Order Details</h1>
                            <p>Food Name: ${dishDetails.foodName}</p>
                            <p>Food Price: ${dishDetails.foodPrice}</p>
                            <p>Food Cataogry: ${dishDetails.foodCatagory}</p>
                            <p>Quantity Offered: ${quantity}</p>
                            <p>Food Cataogry: ${status}</p>
                            </div>
                            `
                        }))
                    })
                }
                else if(status == "Accepted"){
                    firebase.database().ref(`users/restaurants/${restaurantId}`).on("value", (restDetails) => {
                        restDetails = restDetails.val()
                        firebase.database().ref(`users/dishes/${restaurantId}`).on("child_added", (dishDetails => {
                            dishDetails = dishDetails.val()
                            document.getElementById("accepts").innerHTML += `
                            <div class = "border border-1 p-4 mb-2 rounded shadow-lg">
                            <h1>Customer Details </h1>
                            <p>Restaurant Name: ${restDetails.name}</p>
                            <p>Restaurant Email: ${restDetails.email}</p>
                            <p>Restaurant Address: ${restDetails.country, restDetails.city}</p>
                            <div>
                            <h1>Order Details</h1>
                            <p>Food Name: ${dishDetails.foodName}</p>
                            <p>Food Price: ${dishDetails.foodPrice}</p>
                            <p>Food Cataogry: ${dishDetails.foodCatagory}</p>
                            <p>Quantity Offered: ${quantity}</p>
                            <p>Food Cataogry: ${status}</p>
                            </div>
                            `
                        }))
                    })
                    
                }
                else if(status == "Delivered"){
                    firebase.database().ref(`users/restaurants/${restaurantId}`).on("value", (restDetails) => {
                        restDetails = restDetails.val()
                        firebase.database().ref(`users/dishes/${restaurantId}`).on("child_added", (dishDetails => {
                            dishDetails = dishDetails.val()
                            document.getElementById("dilivers").innerHTML += `
                            <div class = "border border-1 p-4 mb-2 rounded shadow-lg">
                            <h1>Customer Details </h1>
                            <p>Restaurant Name: ${restDetails.name}</p>
                            <p>Restaurant Email: ${restDetails.email}</p>
                            <p>Restaurant Address: ${restDetails.country, restDetails.city}</p>
                            <div>
                            <h1>Order Details</h1>
                            <p>Food Name: ${dishDetails.foodName}</p>
                            <p>Food Price: ${dishDetails.foodPrice}</p>
                            <p>Food Cataogry: ${dishDetails.foodCatagory}</p>
                            <p>Quantity Offered: ${quantity}</p>
                            <p>Food Cataogry: ${status}</p>
                            </div>
                            `
                        }))
                    })

                }
                })
        })
    }
    else {
        window.location = "Login.html"
    }
})


function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

let logout = () =>{
    firebase.auth().signOut()
    .then(() =>{
        document.getElementById("headerSignBtn").style.display = "block"
        document.getElementById("headerLoginBtn").style.display = "block"
        document.getElementById("logout").style.display = "none"
    })
  }