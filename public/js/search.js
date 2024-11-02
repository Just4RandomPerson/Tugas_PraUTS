feather.replace()

const icons = document.querySelectorAll('.icons'); 
const modal_artist = document.querySelector('#modal-artist');
const closeBtn = document.getElementById('close-btn');
const closBtnModal = document.querySelectorAll('.close-btn-modal');
const navBar = document.getElementById('nav-bar');
const rightMenu = document.getElementById('right-menu');
const namaArtist = document.querySelectorAll('.artist-name');
const serach = document.getElementById('search-btn');
const awal = document.getElementById('awal')
const akhir = document.getElementById('akhir')

// ketika nama artist ditekan
namaArtist.forEach((artist) => {
    artist.addEventListener('click', ()=> {
        modal_artist.style.display='block'
    })
})

closBtnModal.forEach(btn => {
    btn.addEventListener('click', () => {
        modal_artist.style.display = 'none'
    })
})

window.addEventListener('click', (event) => {
    if (event.target === modal_artist){
        modal_artist.style.display = 'none'
    }
})

// ketika tombol search ditekan
serach.addEventListener('click', () => {
    awal.style.display = 'none'
    akhir.style.display = 'block'
    
})


// untuk bagian right-menu 
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