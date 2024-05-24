const input = document.getElementById('people');
const arr_up = document.querySelector('.arr-up');
const arr_down = document.querySelector('.arr-down');
const arr_right = document.querySelector('.right');
const arr_left = document.querySelector('.left');
const form = document.querySelector('form')
const tables = document.querySelectorAll('.pointer');
const input_table = document.getElementById('table');
const paragraph = document.getElementById('table-name');
const tableornone = document.getElementById('table-or-none');



arr_up.addEventListener('click', () => {
    // console.log('up');
    input.stepUp();
});

arr_down.addEventListener('click', () => {
    // console.log('down');
    input.stepDown();
});


arr_right.addEventListener('click', () => {
  // console.log('right');
  form.style.transform = `translateX(-${form.offsetWidth/2 + 33}px)`;
  
});

arr_left.addEventListener('click', () => {
  // console.log('left');
  form.style.transform = 'translateX(0px)';
  
});

// console.log(form);

// console.log(form.offsetWidth);

// console.log(tables);
// console.log(document.getElementsByClassName('bar'));
// console.log(document.getElementsByClassName('bar')[0].dataset.table);


tables.forEach(table => {
  table.addEventListener('click', () => { 
    if (!tableornone.checked) {
      input_table.value = table.dataset.table;
      // console.log(input_table.value);
      paragraph.innerText = input_table.value; 
    }   
    // console.log(table.value);
    // console.log(table.dataset.table);
  });
});


//see if tableornone is checked
tableornone.addEventListener('click', () => {
  if(tableornone.checked) {
    //1. change the value of input_table to none
    input_table.value = 'none';
    //2. change the cursor of contaier1 to not-allowed
    document.querySelector('.container1').style.cursor = 'not-allowed';
    tables.forEach(table => {
      table.style.cursor = 'not-allowed';
    });
    //3. change the color of container1 to gray
    document.querySelector('.container1').style.backgroundColor = 'gray';
    
    // console.log('checked');

  }
  else {
    document.querySelector('.container1').style.cursor = '-webkit-grab';
    tables.forEach(table => {
      table.style.cursor = 'pointer';
    });
    // console.log('unchecked');
     
  }
});


// document.querySelector('.container1').addEventListener('click', () => {
//    console.log(input_table.value); 
// });









