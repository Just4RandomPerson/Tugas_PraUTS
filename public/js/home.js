feather.replace();

const navBar = document.getElementById('nav-bar');
const rightMenu = document.getElementById('right-menu');
const closeBtn = document.getElementById('close-btn')

navBar.addEventListener('click', () => {
    rightMenu.style.display = 'block'
    navBar.style.display = 'none'
})

closeBtn.addEventListener('click', () =>{
    rightMenu.style.display = 'none'
    navBar.style.display = 'block'
})

window.addEventListener('click', (event) => {
    if (event.target === rightMenu){
        rightMenu.style.display = 'none'
        navBar.style.display = 'block'
    }
})