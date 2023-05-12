// Declare an array to hold the links, and get the error message element, input element, and button elements from the DOM
let myLinks = [];
let errorMsg = document.getElementById("error-msg")
const inputEl = document.getElementById('input-el');
const inputBtn = document.getElementById('save-btn');
const ulEl = document.getElementById("ul-el");
const tabBtn = document.getElementById("tab-btn")
const deleteBtn = document.getElementById("delete-btn");

// Get any links stored in local storage and render them on the page if they exist
const linksFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"));
if (linksFromLocalStorage) {
    myLinks = linksFromLocalStorage;
    render(myLinks);
}

// Event listener for the "tab-btn" button to get the active tab URL and add it to the links array and local storage
tabBtn.addEventListener("click", function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        const url = tabs[0].url;
        myLinks.push(url);
        localStorage.setItem("myLinks", JSON.stringify(myLinks));
        render(myLinks);
    })
});

// Function to validate a URL using a regular expression
function isValidUrl(url) {
    const urlRegex = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return urlRegex.test(url);
}

// Function to render the links on the page
function render(links) {
    let uniqueLinks = new Set(links);
    let listItems = "";

    for (let link of uniqueLinks) {
        listItems += `
            <li>
                <a target='_blank' href='${link}'>
                    ${link}
                </a>
            </li>
        `;
    }

    ulEl.innerHTML = listItems;
}

// Event listener for the "delete-btn" button to clear local storage and the links array, and render an empty list on the page
deleteBtn.addEventListener("dblclick", function () {
    localStorage.clear();
    myLinks = [];
    render(myLinks);
});

// Event listener for the "save-btn" button to add a new link to the links array and local storage, and render the updated list on the page
inputBtn.addEventListener('click', function () {
    const url = inputEl.value.trim().replace(/\s+/g, '');
    // If the input is empty, display an error message
    if (url === "") {
        errorMsg.innerText = "The link cannot be empty. Please provide a valid URL to continue.";
        // If the input is a valid URL, add it to the links array and local storage, and render the updated list
    } else if (isValidUrl(url)) {
        myLinks.push(url);
        inputEl.value = "";
        localStorage.setItem("myLinks", JSON.stringify(myLinks));
        render(myLinks);
        errorMsg.innerText = "";
        // If the input is not a valid URL, display an error message
    } else {
        errorMsg.innerText = "Invalid input. Please enter a valid URL and try again.";
    }
});
