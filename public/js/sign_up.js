feather.replace();

// check password dan confirmation apakah sama
function check(event){
    const e_password = document.getElementById('password').value
    const e_confirm = document.getElementById('confirm').value
    let e_alertBoxE = document.getElementById("alertBoxE")
    let e_alertBoxS = document.getElementById('alertBoxS')
    // jika password dan confirmation tidak sama 
    if(e_password != e_confirm){
        event.preventDefault()
        e_alertBoxE.classList.add("show");
    }

    // jika password dan confirmation sama 
    else{
        event.preventDefault()
        e_alertBoxS.classList.add("show")
    }
}

function closeAlert() {
    let e_alertBoxE = document.getElementById('alertBoxE');
    e_alertBoxE.classList.remove("show"); // Sembunyikan alert saat ditutup

    let e_alertBoxS = document.getElementById('alertBoxS')
    e_alertBoxS.classList.remove("show")
}
