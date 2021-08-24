let phone = document.querySelector('.mn-phone');


let width = window.innerWidth;

// console.log(width > 992)


setInterval(() => {
  if (width < 768){
  phone.classList.remove('mn-phone');
  email.classList.remove('mn-email');
}

}, 2000);



let hamburger = document.getElementById('navbarText')
let listItems = document.querySelectorAll('#small-nav .nav-item');

listItems.forEach(item =>{
  item.addEventListener('click', ()=>{
    hamburger.classList.remove('show');
    console.log('clicked')
  })
})

