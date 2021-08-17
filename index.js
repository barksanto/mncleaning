let phone = document.querySelector('.mn-phone');


let width = window.innerWidth;

// console.log(width > 992)


setInterval(() => {
  if (width < 768){
  phone.classList.remove('mn-phone')
  email.classList.remove('mn-email')
}

}, 2000);
