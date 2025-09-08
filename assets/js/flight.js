const bookFlightButton=document.querySelectorAll('.book-flight-button');
bookFlightButton.forEach((btn)=>{
    btn.addEventListener('click',()=>{
        location.href='bookFlight.html';
    })
})