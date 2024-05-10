const input = document.getElementById('people');
const arr_up = document.querySelector('.arr-up');
const arr_down = document.querySelector('.arr-down');
const arr_right = document.querySelector('.right');
const arr_left = document.querySelector('.left');
const form = document.querySelector('form')



arr_up.addEventListener('click', () => {
    console.log('up');
    input.stepUp();
});

arr_down.addEventListener('click', () => {
    console.log('down');
    input.stepDown();
});


arr_right.addEventListener('click', () => {
  console.log('right');
  form.style.transform = `translateX(-${form.offsetWidth/2 + 33}px)`;
  
});

arr_left.addEventListener('click', () => {
  console.log('left');
  form.style.transform = 'translateX(0px)';
  
});

console.log(form);

console.log(form.offsetWidth);



