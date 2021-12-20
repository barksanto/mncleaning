var acc = document.getElementsByClassName("accordion");
var panel = document.getElementsByClassName('panel');

for (var i = 0; i < acc.length; i++) {
    acc[i].onclick = function() {
        var setClasses = !this.classList.contains('active');
        setClass(acc, 'active', 'remove');
        setClass(panel, 'show', 'remove');

        if (setClasses) {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
        // this.innerHTML = "Q1. What currency is the course charged in? <span class='open-close-arrow'><i data-feather='chevron-down' class='chevron' style='float: right;'></i></span>";

    }
}

function setClass(els, className, fnName) {
    for (var i = 0; i < els.length; i++) {
        els[i].classList[fnName](className);
    }
}


// chevron change- attempt
// const firstFaq = document.querySelector(".ac-1");
// console.log(firstFaq.classList.contains('accordion'));
// document.addEventListener('click', ()=>{
//   if(firstFaq.classList.contains('active')){
//     firstFaq.innerHTML = "Q1. What currency is the course charged in?<span class='open-close-arrow'><i data-feather='circle' class='chevron-down' style='float: right;'></i></span>"
// }
// })


