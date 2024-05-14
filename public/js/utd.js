
let logcheck = document.getElementById('lgout')
let changeText = document.getElementById('changetext')

let historyPath = document.referrer;
let currentPath = window.location.href;

// if (logcheck !== null) {

//     const updatefun = () => {
//         window.location.href = "http://localhost:8000/dashboard";
//     }
//     logcheck.addEventListener('click', updatefun);
// }


if (currentPath.slice(0, 29) === 'http://localhost:8000/logout/') {

    changeText.innerHTML = 'You have been logout successfully';

    function buttonClick(){
        changeText.style.color = 'green';
       }

    const backBtn = () => {
        changeText.click();
        history.pushState(null, null, document.URL);
    }
    backBtn();
    window.addEventListener('popstate', backBtn);

    // window.onbeforeunload = function () { return "Your work will be lost."; };

    // window.addEventListener('beforeunload', function (event) {
       
    //     event.preventDefault();
    //     event.returnValue = 'Are you sure you want to leave this page?';
    
    //   });

    // sessionStorage.setItem('visitedPage', 'true');

    // window.addEventListener('DOMContentLoaded', function() {
    //     if (sessionStorage.getItem('visitedPage') === 'true') {
    //       // Redirect the user to a different page
    //       window.location.href = 'http://localhost:8000/login';
    //     }
    //   });
      

}

if (currentPath.slice(0, 29) === 'http://localhost:8000/delete/') {

    changeText.innerHTML = 'Your Data has been deleted, Please <a href="/ragistration">Register Here</a> if you want to login again';
    changeText.style.color = 'orange';

    window.location.hash = "no-back-button";
    window.location.hash = "Again-no-back-button";//for google chrome
    window.onhashchange = function () { window.location.hash = "no-back-button"; }

}
