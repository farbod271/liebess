// function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//   }
  
//   const csrfToken = getCookie('_csrf');
//   console.log(csrfToken);
  
//   const input = document.querySelector('input[name="_csrf"]');
//   input.value = csrfToken;


  console.log('Hello World!');

  document.addEventListener('click', () => {
    console.log('You clicked on the page!');
  });

