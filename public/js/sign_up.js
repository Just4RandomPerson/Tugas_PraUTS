feather.replace();

// check password dan confirmation apakah sama
function check(event){
    event.preventDefault();
    const e_password = document.getElementById('passwords').value
    const e_confirm = document.getElementById('confirm').value
    let e_alertBoxE = document.getElementById("alertBoxE")
    let e_alertBoxS = document.getElementById('alertBoxS')

    // jika password dan confirmation tidak sama 
    if(e_password !== e_confirm){
        // event.preventDefault()
        // e_alertBoxE.classList.add("show");
        e_alertBoxE.classList.add("show");
        return;
    }

    // If password and confirmation sama
    let e_email = document.getElementById('emails').value;
    const data = {
        email: e_email,
        password: e_password
    };

    // Send data to server
    fetch('/sign_up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            e_alertBoxS.classList.add("show");
            console.log("Sign up success");
        } else {
            e_alertBoxE.classList.add("show");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        e_alertBoxE.classList.add("show");
    });
}

function closeAlert() {
    let e_alertBoxE = document.getElementById('alertBoxE');
    e_alertBoxE.classList.remove("show"); // Sembunyikan alert saat ditutup

    let e_alertBoxS = document.getElementById('alertBoxS')
    e_alertBoxS.classList.remove("show")
}

function login(event) {
    event.preventDefault(); // Prevent form submission

    const p_email = document.getElementById('emails').value;
    const p_password = document.getElementById('passwords').value;
    let alertBoxE = document.getElementById("alertBoxE");

    const data = {
        email: p_email,
        password: p_password
    };

    // Send data to server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            window.location.href = '/home'; // Redirect to home.html
        } else {
            alertBoxE.classList.add("show");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alertBoxE.classList.add("show");
    });
}