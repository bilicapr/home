console.log('%cCopyright © 2024-2025 Caleb XXY', 'background-color: #a285e6; color: white; font-size: 24px; font-weight: bold; padding: 10px;');
console.log('%c   /\\_/\\', 'color: #f7b267; font-size: 20px;');
console.log('%c  ( o.o )', 'color: #f7b267; font-size: 20px;');
console.log(' %c  > ^ <', 'color: #f7b267; font-size: 20px;');
console.log('  %c /  ~ \\', 'color: #f7b267; font-size: 20px;');
console.log('  %c/______\\', 'color: #f7b267; font-size: 20px;');




document.addEventListener('contextmenu', function(event) {
  event.preventDefault(); // 阻止默认的上下文菜单行为
});


function openTab(tabName) {
    // Hide all tab content
    var tabContents = document.getElementsByClassName('tab-content');
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('content-active');
    }
    
    // Remove active class from all buttons
    var tabButtons = document.getElementsByClassName('tab-button');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('but-active');
    }
    
    // Show the selected tab content
    document.getElementById(tabName).classList.add('content-active');
    
    // Add active class to the clicked button
    event.target.classList.add('but-active');
}


function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        element.classList.toggle(className);
    });
}

function PopUp(imageURL) {
    var popupMainElement = document.querySelector(".pop-up-img");
    if (imageURL) {
        popupMainElement.src = imageURL;
    }
    toggleClass(".pop-up-main", "active");
    toggleClass(".pop-up", "active");
    toggleClass(".pop-up-close", "active");
}

function playSound(soundUrl) {
  const audio = new Audio(soundUrl);
  audio.play().catch(e => console.error("Failed to play sound effect:", e));
}

function left() {
    toggleClass(".left-main", "left-main-open");
    toggleClass(".left", "left-open");

}


document.addEventListener('DOMContentLoaded', function () {


    var themeState = getCookie("themeState") || "Light";
    const htmlTag = document.querySelector('html');
    var svgItems = document.getElementsByTagName("svg");
    var tanChiShe = document.getElementById("tanChiShe");




    function changeSvg(color) {
        for (var i = 0; i < svgItems.length; i++) {
            var paths = svgItems[i].getElementsByTagName("path");
            for (var j = 0; j < paths.length; j++) {
                paths[j].setAttribute("fill", color);
            }
        }
    }



    function changeTheme(theme) {
        if (theme == "Dark") {
            themeState = "Dark";
            changeSvg("#ffffff");
            tanChiShe.src = "https://ghfast.top/https://raw.githubusercontent.com/bilicapr/bilicapr/output/github-contribution-grid-snake-dark.svg";
            htmlTag.dataset.theme = 'dark';
        } else if (theme == "Light") {
            themeState = "Light";
            changeSvg("#000000");
            tanChiShe.src = "https://ghfast.top/https://raw.githubusercontent.com/bilicapr/bilicapr/output/github-contribution-grid-snake-dark.svg";
            htmlTag.dataset.theme = '';
        }
        setCookie("themeState", theme, 365);
    }




    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }


    function getCookie(name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) == 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }


    document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
            playSound('../static/soundeffects/click.mp3');
        });
    });

    const switchCheckbox = document.getElementById('myonoffswitch');
    /*夜间自动打开暗色主题*/
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    if (currentHour >= 20 || currentHour < 6) {
        switchCheckbox.checked = false;
        changeTheme('Dark');
    }


    switchCheckbox.addEventListener('change', function () {

        if (themeState == "Dark") {

            playSound('../static/soundeffects/light-on.mp3')
            changeTheme("Light");

        } else if (themeState == "Light") {

            playSound('../static/soundeffects/light-off.mp3')
            changeTheme("Dark");
        }
    });

    if (themeState == "Dark") {
        switchCheckbox.checked = false;
    }
    changeTheme(themeState);




    /*加载效果*/
    // var pageLoading = document.querySelector("#PageLoading");
    // var center = document.getElementById("PageLoading-zyyo-center");
    // setTimeout(function () {
    //     pageLoading.style.opacity = '0';
    //     center.style.height = "500px";
    //     center.style.width = "500px";
    //     center.style.opacity = "0";
    //     pageLoading.style.backgroundSize = "200%";
    // }, 300);

    // 暂时强制深色模式
    // changeTheme("Dark")

    /*淡入效果*/
    var projectItems = document.querySelectorAll(".projectItem");
    function checkProjectItems() {
        for (var i = 0; i < projectItems.length; i++) {
            var projectItem = projectItems[i];
            var projectItemTop = projectItem.getBoundingClientRect().top;

            if (projectItemTop < window.innerHeight * 1.2) {
                // projectItem.classList.add("fade-in-visible");
            }
        }
    }

    window.addEventListener("scroll", checkProjectItems);
    window.addEventListener("resize", checkProjectItems);

});

// FAQ Toggle Function
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');

    playSound('../static/soundeffects/collapsible_open.mp3')
    
    // Close all other FAQ items
    // const allFaqItems = document.querySelectorAll('.faq-item');
    // allFaqItems.forEach(item => {
    //     item.classList.remove('active');
    // });

    // Collapse current FAQ item
    if (isActive) {
        faqItem.classList.remove('active');
    }
    
    // Toggle current FAQ item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}