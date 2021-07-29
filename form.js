  
  // handlesubmit
  var form = document.getElementById("my-form");
    
    async function handleSubmit(event) {
      event.preventDefault();
      var status = document.getElementById("my-form-status");
      var data = new FormData(event.target);

      console.log(data)

      fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      }).then(response => {
        status.innerHTML = "Thanks for your submission!";
        form.reset()
      }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting your form"
      });
    }

    form.addEventListener("submit", handleSubmit)

// HANDLE NEXT


//form pages
const page1 = document.getElementById('page-1');
const page2 = document.getElementById('page-2');
const page3 = document.getElementById('page-3');
const page4 = document.getElementById('page-4');

// next buttons
let next1 = document.getElementById('next-1');
let next2 = document.getElementById('next-2');
let next3 = document.getElementById('next-3');

//back buttons
let back2 = document.getElementById('back-2');
let back3 = document.getElementById('back-3');
let back4 = document.getElementById('back-4');

let formPageCount = 1;
// event listeners to +/- 
let nextBtns = [next1, next2, next3];
let backBtns = [back2, back3, back4];

nextBtns.forEach(btn => {
  btn.addEventListener('click', ()=>{
  formPageCount +=1
  checkPage()
  console.log(formPageCount)
})
})

backBtns.forEach(btn => {
  btn.addEventListener('click', ()=>{
  formPageCount -=1
  checkPage()
  console.log(formPageCount)
})
})


function checkPage(){
  switch(formPageCount) {
  case 1:
    page1.classList.remove('d-none')
    page2.classList.add('d-none')
    break;
  case 2:
    page1.classList.add('d-none')
    page2.classList.remove('d-none')
    page3.classList.add('d-none')
    break;
  case 3:
    page2.classList.add('d-none')
    page3.classList.remove('d-none')
    page4.classList.add('d-none')
    break;
  case 4:
    page3.classList.add('d-none')
    page4.classList.remove('d-none')
    break;
  default:
    // code block
    break;
}
}

