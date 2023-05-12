let myLinks = []
const inputEl = document.getElementById('input-el')
const inputBtn = document.getElementById('input-btn')
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const linksFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"))
const tabBtn = document.getElementById("tab-btn")

if (linksFromLocalStorage) {
    myLinks = linksFromLocalStorage
    render(myLinks)
}
tabBtn.addEventListener("click", function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        myLinks.push(tabs[0].url)
        localStorage.setItem("myLinks", JSON.stringify(myLinks))
        render(myLinks)
    })
})

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

deleteBtn.addEventListener("dblclick", function () {
    localStorage.clear()
    myLinks = []
    render(myLinks)
})

inputBtn.addEventListener('click', function () {
    let link = inputEl.value.trim().replace(/\s+/g, '');
    if (link !== "") {
        myLinks.push(link);
        inputEl.value = "";
        localStorage.setItem("myLinks", JSON.stringify(myLinks));
        render(myLinks);
    }
});
