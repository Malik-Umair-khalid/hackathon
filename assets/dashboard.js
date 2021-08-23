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


function  openCity(evt, cityName) {
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

let saveProduct = async  () => {
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
            }
            foodName = ""
            foodPrice = ""
            foodImage.files.length = 0
            console.log(food)
            document.getElementById("close").click()
        })
    }

}

firebase.auth().onAuthStateChanged((user) => {
    firebase.database().ref(`pendings/${user.uid}`).on("child_added" , (orders) =>{
        
        let status = orders
        orders = orders.val()
        let cusId = orders.userInfo;
        let prodId = orders.dishId;
        console.log(orders)
        if(orders.status == "pending"){
        firebase.database().ref(`users/customers/${cusId}`).on("value" , (userInfo) =>{
        let cusDetails = userInfo.val()
        firebase.database().ref(`users/dishes/${user.uid}/${prodId}`).on("value" , (pendings) =>{
        let orderDetails = pendings.val()
        document.getElementById("pend").innerHTML += `
        <div class = "border border-1 p-4 mb-2 rounded shadow-lg">
        <h1>Customer Details </h1>
        <p>Customer Name: ${cusDetails.name}</p>
        <p>Customer Email: ${cusDetails.email}</p>
        <p>Customer Contact: ${cusDetails.contact}</p>
        <p>Customer Address: ${cusDetails.country, cusDetails.city}</p>
        <div>
            <h1>Order Details</h1>
          <p>Food Name: ${orderDetails.foodName}</p>
          <p>Food Price: ${orderDetails.foodPrice}</p>
          <p>Food Cataogry: ${orderDetails.foodCatagory}</p>
        </div>
        <div>
        <div id="statusDiv">
        <button onclick= "accept(this, '${status.key}','${user.uid}')" class=" m-4 btn btn-outline-success">Accept</button>
        <button onclick="reject(this, '${status.key}','${user.uid}')" class=" m-4 btn btn-outline-danger">Reject</button>
        </div>
        </div> 
        `
        })
        })
    }
    else if(orders.status == "Accepted"){
        firebase.database().ref(`users/customers/${cusId}`).on("value" , (userInfo) =>{
            let cusDetails = userInfo.val()
            firebase.database().ref(`users/dishes/${user.uid}/${prodId}`).on("value" , (pendings) =>{
            let orderDetails = pendings.val()
            document.getElementById("accepts").innerHTML += `
            <div class = "border border-1 p-4 mb-2 rounded shadow-lg">
            <h1>Customer Details </h1>
            <p>Customer Name: ${cusDetails.name}</p>
            <p>Customer Email: ${cusDetails.email}</p>
            <p>Customer Contact: ${cusDetails.contact}</p>
            <p>Customer Address: ${cusDetails.country, cusDetails.city}</p>
            <div>
                <h1>Order Details</h1>
              <p>Food Name: ${orderDetails.foodName}</p>
              <p>Food Price: ${orderDetails.foodPrice}</p>
              <p>Food Cataogry: ${orderDetails.foodCatagory}</p>
            </div>
            <div>
            <div id="statusDiv">
            <button onclick="deliver(this, '${status.key}','${user.uid}')" class="btn btn-outline-success">Diliver</button>
            </div>
            </div> 
            `
            })
            })
    }
    else if(orders.status == "Delivered"){
        firebase.database().ref(`users/customers/${cusId}`).on("value" , (userInfo) =>{
            let cusDetails = userInfo.val()
            firebase.database().ref(`users/dishes/${user.uid}/${prodId}`).on("value" , (pendings) =>{
            let orderDetails = pendings.val()
            document.getElementById("dilivers").innerHTML += `
            <div class = "border border-1 p-4 mb-2 rounded shadow-lg">
            <h1>Customer Details </h1>
            <p>Customer Name: ${cusDetails.name}</p>
            <p>Customer Email: ${cusDetails.email}</p>
            <p>Customer Contact: ${cusDetails.contact}</p>
            <p>Customer Address: ${cusDetails.country, cusDetails.city}</p>
            <div>
                <h1>Order Details</h1>
              <p>Food Name: ${orderDetails.foodName}</p>
              <p>Food Price: ${orderDetails.foodPrice}</p>
              <p>Food Cataogry: ${orderDetails.foodCatagory}</p>
            </div>
            <div>
            <div id="statusDiv">
            <button disabled class="btn btn-outline-success">Dilivered</button>
            </div>
            </div> 
            `
            })
            })
    }
    })
})

let accept = (btn, oid,uid) =>{
     btn.parentNode.remove()
     firebase.database().ref(`pendings/${uid}/${oid}`).update({
         status: "Accepted"
     })
     window.location.reload()    
}
let reject = (btn,oid,uid) =>{
    btn.parentNode.remove()
    firebase.database().ref(`pendings/${uid}/${oid}`).update({
        status: "Rejected"
    })
    window.location.reload()
}
let deliver = (btn,oid,uid) =>{
    btn.parentNode.parentNode.remove()
    firebase.database().ref(`pendings/${uid}/${oid}`).update({
        status: "Delivered"
    })
    window.location.reload()
}