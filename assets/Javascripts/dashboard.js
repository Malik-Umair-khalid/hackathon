firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("headerSignBtn").style.display = "none"
        document.getElementById("headerLoginBtn").style.display = "none"
        document.getElementById("logout").style.display = "block"
        let uid = user.uid
        firebase.database().ref(`users/${uid}`).once("value")
            .then((userInfo) => {
                let Details = userInfo.val()
            })
    } else if (!user) {
        window.location = "Login.html"
    }
});

let logout = () => {
    firebase.auth().signOut()
        .then(() => {
            document.getElementById("headerSignBtn").style.display = "block"
            document.getElementById("headerLoginBtn").style.display = "block"
            document.getElementById("logout").style.display = "none"
            window.location = "../index.html"
        })
}

let uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        if (file) {
            // let bar = document.getElementById("bar")
            let storagref = firebase.storage().ref(`profileImage/${file.name}`)
            let uploading = storagref.put(file)
            uploading.on('state_changed',
                (snapshot) => {
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    reject(error)
                },
                () => {
                    uploading.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        resolve(downloadURL)
                    });
                }
            );

        }
    })
}


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

let saveProduct = async () => {
    let foodName = document.getElementById("foodName")
    let foodPrice = document.getElementById("foodPrice")
    let foodCatagory = document.getElementById("foodCatagory")
    let deleveryType = document.getElementById("DeleveryType")
    let foodImage = document.getElementById("foodImage")
    console.log(foodName.value)
    if (foodName.value == "") {
        foodName.classList.add("Validiation")
        foodName.classList.remove("myInput")
        foodName.placeholder = "The Name Is Not Valid"
        foodName.focus()
    }
    else if (foodPrice.value == "") {
        foodPrice.classList.add("Validiation")
        foodPrice.classList.remove("myInput")
        foodPrice.placeholder = "The Name Is Not Valid"
        foodPrice.focus()
    }
    else if (foodImage.files.length === 0) {
        swal("Noop!", "Please Add The Image!", "warning");
    }
    else {
        let food = await uploadImage(foodImage.files[0])
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebase.database().ref(`users/dishes/${user.uid}`).push({
                    foodName: foodName.value,
                    foodPrice: foodPrice.value,
                    foodCatagory: foodCatagory.value,
                    foodImagE: food,
                    deleveryType: deleveryType.value,
                })
                foodName.value = ""
                foodPrice.value = ""
                foodImage.files.length = 0
                console.log(food)
                document.getElementById("close").click()
            }
        })
    }

}

firebase.auth().onAuthStateChanged((user) => {
    firebase.database().ref(`pendings`).on("child_added", (userKey) => {
        let userId = userKey.key
        console.log(user.uid)
        firebase.database().ref(`pendings/${userId}`).on("child_added" , (orders) =>{
            let orderKey = orders.key
            let status = orders.val().status
            orders = orders.val()
            let cusId = orders.userInfo;
            let prodId = orders.dishId;
            let quantity = orders.quantity;
        if (orders.status == "pending") {
            
            firebase.database().ref(`users/customers/${cusId}`).on("value", (userInfo) => {
                let cusDetails = userInfo.val()
                firebase.database().ref(`users/dishes/${user.uid}/${prodId}`).on("value", (pendings) => {
                    let orderDetails = pendings.val()
                    if(orderDetails){
                    document.getElementById("pend").innerHTML += `
        <div class = "border border-1 p-4 mb-2 rounded shadow-lg">
        <h1>Customer Details </h1>
        <p>Customer Name: ${cusDetails.name}</p>
        <p>Customer Email: ${cusDetails.email}</p>
        <p>Customer Contact: ${cusDetails.contact}</p>
        <p>Customer Address: ${cusDetails.city +  cusDetails.country }</p>
        <div>
            <h1>Order Details</h1>
          <p>Food Name: ${orderDetails.foodName}</p>
          <p>Food Price: ${orderDetails.foodPrice}</p>
          <p>Food Cataogry: ${orderDetails.foodCatagory}</p>
          <p class = "fw-bold">Food Bill: ${orderDetails.foodPrice * quantity}</p>
        </div>
        <div>
        <div id="statusDiv">
        <button onclick= "accept(this,'${userId}','${orderKey}')" class=" m-4 btn btn-outline-success">Accept</button>
        <button onclick="reject(this,'${userId}','${orderKey}')" class=" m-4 btn btn-outline-danger">Reject</button>
        </div>
        </div> 
        `
    }
                })
            })
        }
        else if (orders.status == "Accepted") {
            document.getElementById("accepts").innerHTML = ""
            firebase.database().ref(`users/customers/${cusId}`).on("value", (userInfo) => {
                let cusDetails = userInfo.val()
                firebase.database().ref(`users/dishes/${user.uid}/${prodId}`).on("value", (pendings) => {
                    let orderDetails = pendings.val()
                    if(orderDetails){
                    document.getElementById("accepts").innerHTML += `
            <div class = "border border-1 p-4 mb-2 rounded shadow-lg">
            <h1>Customer Details </h1>
            <p>Customer Name: ${cusDetails.name}</p>
            <p>Customer Email: ${cusDetails.email}</p>
            <p>Customer Contact: ${cusDetails.contact}</p>
            <p>Customer Address: ${cusDetails.city +  cusDetails.country }</p>
            <div>
                <h1>Order Details</h1>
              <p>Food Name: ${orderDetails.foodName}</p>
              <p>Food Price: ${orderDetails.foodPrice}</p>
              <p>Food Cataogry: ${orderDetails.foodCatagory}</p>
              <p class = "fw-bold">Food Bill: ${orderDetails.foodPrice * quantity}</p>
            </div>
            <div>
            <div id="statusDiv">
            <button onclick="deliver(this,'${userId}','${orderKey}')" class="btn btn-outline-success">Diliver</button>
            </div>
            </div> 
            `
        }
                })
            })
        }
        else if (orders.status == "Delivered") {
            document.getElementById("dilivers").innerHTML = ""
            firebase.database().ref(`users/customers/${cusId}`).on("value", (userInfo) => {
                let cusDetails = userInfo.val()
                firebase.database().ref(`users/dishes/${user.uid}/${prodId}`).on("value", (pendings) => {
                    let orderDetails = pendings.val()
                    if(orderDetails){
                    document.getElementById("dilivers").innerHTML += `
            <div class = "border border-1 p-4 mb-2 rounded shadow-lg">
            <h1>Customer Details </h1>
            <p>Customer Name: ${cusDetails.name}</p>
            <p>Customer Email: ${cusDetails.email}</p>
            <p>Customer Contact: ${cusDetails.contact}</p>
            <p>Customer Address: ${cusDetails.city +  cusDetails.country }</p>
            <div>
                <h1>Order Details</h1>
              <p>Food Name: ${orderDetails.foodName}</p>
              <p>Food Price: ${orderDetails.foodPrice}</p>
              <p>Food Cataogry: ${orderDetails.foodCatagory}</p>
              <p class = "fw-bold">Food Bill: ${orderDetails.foodPrice * quantity}</p>
            </div>
            <div>
            <div id="statusDiv">
            <button disabled class="btn btn-outline-success">Dilivered</button>
            </div>
            </div> 
            `
        }
                })
            })
        }
    })
    })
})

let accept = (btn, uid, oid) => {
    btn.parentNode.remove()
    firebase.database().ref(`pendings/${uid}/${oid}`).update({
        status: "Accepted"
    })
    window.location.reload()
}
let reject = (btn, uid, oid) => {
    btn.parentNode.remove()
    firebase.database().ref(`pendings/${uid}/${oid}`).update({
        status: "Rejected"
    })
    window.location.reload()
}
let deliver = (btn, uid, oid) => {
    btn.parentNode.parentNode.remove()
    firebase.database().ref(`pendings/${uid}/${oid}`).update({
        status: "Delivered"
    })
    window.location.reload()
}
let dishes = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log(user)
            firebase.database().ref(`users/dishes/${user.uid}`).on("child_added", (res) => {
                let foodDetails = res.val();
                document.getElementById("dishes").innerHTML +=
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
                    <button type="button" class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#modelId1" onclick = "edit('${res.key}','${user.uid}')" class = "btn btn-primary">Edit</button>
                </div>
                </div>
                `
            })

        }
    })
}
dishes()
let edit = (dsihId, RestId) => {
    let foodNameE = document.getElementById("foodNameE")
    let foodPriceE = document.getElementById("foodPriceE")
    let foodCatagoryE = document.getElementById("foodCatagoryE")
    let DeleveryTypeE = document.getElementById("DeleveryTypeE")
    let foodImageE = document.getElementById("foodImageE")
    let jugar = document.getElementById("jugar")
    jugar.value = dsihId
    console.log(jugar)
    console.log(RestId)


    firebase.database().ref(`users/dishes/${RestId}/${dsihId}`).on("value", (dishData) => {
        foodNameE.value = dishData.val().foodName
        foodPriceE.value = dishData.val().foodPrice
        foodCatagoryE.value = dishData.val().foodCatagory
        DeleveryTypeE.value = dishData.val().deleveryType
    })
}

let update = async () => {
    let foodNameE = document.getElementById("foodNameE")
    let foodPriceE = document.getElementById("foodPriceE")
    let foodCatagoryE = document.getElementById("foodCatagoryE")
    let DeleveryTypeE = document.getElementById("DeleveryTypeE")
    let dishID = document.getElementById("jugar")
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            firebase.database().ref(`users/dishes/${user.uid}/${dishID.value}`).update({
                foodName: foodNameE.value,
                foodPrice: foodPriceE.value,
                foodCatagory: foodCatagoryE.value,
                deleveryType: DeleveryTypeE.value,
            })
            document.getElementById("close1").click()
        }
    }

    )
}


