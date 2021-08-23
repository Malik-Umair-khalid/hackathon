
let uploadImage = (file) =>{
    return new Promise((resolve, reject) =>{  
    if(file){ 
      let bar = document.getElementById("bar")
    let storagref = firebase.storage().ref(`profileImage/${file.name}`)
     let uploading =  storagref.put(file)
      uploading.on('state_changed',
      (snapshot) => {
         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         bar.style.width = Math.round(progress.toFixed()) + "%";
         bar.innerHTML = Math.round(progress.toFixed()) + "%";
         if(bar.style.width == "100%"){
          bar.style.width = "0%"
          bar.innerHTML = ""
          swal("Good Job!", "Image Added Successfully!", "success");     
         }
         bar.innerHTML = Math.round(progress.toFixed()) + "%";
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

const signIn = async () => {
    let name = document.getElementById("name")
    let contact = document.getElementById("contact")
    let country = document.getElementById("country")
    let city = document.getElementById("city")
    let email = document.getElementById("email")
    let profile = document.getElementById("profile")
    let passward = document.getElementById("passward")
    let regForName = /^[a-z ,.'-]+$/i
    let regForMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    
    // console.log(name.value,contact.value, country.value, city.value , email.value , profile.files , passward.val)

    let signBtn = document.getElementById("signupBtn")
    let loader = document.getElementById("loader")
    signBtn.style.display = "none"
    loader.style.display = "block"
  
    if (!regForName.test(name.value)) {
      name.value = ""    
      name.classList.add("Validiation")
      name.classList.remove("myInput")
      name.placeholder = "The Name Is Not Valid"
      name.focus()
      signBtn.style.display = "block"
      loader.style.display = "none"
    }
    else if (!regForMail.test(email.value)) {
        email.classList.add("Validiation")
        email.classList.remove("myInput")
        email.placeholder = "The Name Is Not Valid"
        email.focus()
        signBtn.style.display = "block"
        loader.style.display = "none"
      }
    else if (contact.value.length != 11) {
      contact.classList.add("Validiation")
      contact.classList.remove("myInput")
      contact.placeholder = "The Number Is Not Valid"
      contact.focus()
      signBtn.style.display = "block"
      loader.style.display = "none"
    }
    else if (country.value == "") {
      country.classList.add("Validiation")
      country.classList.remove("myInput")
      country.placeholder = "Please Fill This Field"
      country.focus()
      signBtn.style.display = "block"
      loader.style.display = "none"
    }
    else if (city.value == "") {
      city.classList.add("Validiation")
      city.classList.remove("myInput")
      city.placeholder = "Please Fill This Field"
      city.focus()
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
    else if(profile.files.length === 0){
            swal("Noop!", "Please Add The Image!", "warning");
            signBtn.style.display = "block"
            loader.style.display = "none"
    }
    else {
        let image = await uploadImage(profile.files[0])

        let userInfo = {
          name: name.value,
          contact: contact.value,
          country: country.value,
          city: city.value,
          profileImage: image,
          email: email.value,
          role: "User"
        }


      firebase.auth().createUserWithEmailAndPassword(email.value, passward.value)
        .then((res) => {
            name.value = ""
            email.value = ""
            contact.value =""
            country.value = ""
            city.value = ""
            passward.value = ""
            profile.files.length = 0
          // firebase.database().ref(`users/`).child(res.user.uid).set(userInfo)
          firebase.database().ref(`users/customers/${res.user.uid}`).set(userInfo)
            .then(() => {
                var errorDiv = document.getElementById("errorDiv")
                errorDiv.style.color = 'green'
                localStorage.setItem("uid", res.user.uid)
                errorDiv.style.fontSize = "15px"
                errorDiv.innerText = "You Are Successfully Signed In"
                signBtn.style.display = "block"
                loader.style.display = "none"
              setTimeout(() => {
              window.location = "Login.html"
            }, 500)
            })
        })
        .catch((error) => {
          var errorMessage = error.message;
          console.log(errorMessage)
          var errorDiv = document.getElementById("errorDiv")
          errorDiv.innerText = errorMessage
          signBtn.style.display = "block"
          loader.style.display = "none"
        });
    }
  }

