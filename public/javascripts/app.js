const search = document.querySelector(".searchBar");
const searchFail = document.createElement("h2");
search.insertAdjacentElement("afterend", searchFail);
searchFail.innerText = "Sorry, no results found";
searchFail.style.margin = "10px";
searchFail.style.color = "#cfdbd5";
searchFail.classList.add("searchHide");

function searchBooks() {
  const searchInput = search.value.toLowerCase();
  const books = document.querySelectorAll("td");
  let matchNo = 0;

  for (let i = 0; i < books.length; i++) {
    if (books[i].innerText.toLowerCase().includes(searchInput)) {
      matchNo += 1;
      books[i].parentNode.classList.remove("searchHide");
      searchFail.classList.add("searchHide");
    } else if (!names[i].innerText.toLowerCase().includes(searchInput)) {
      names[i].parentNode.classList.add("searchHide");
    } else if (!searchInput) {
      names[i].parentNode.parentNode.classList.remove("searchHide");
      searchFail.classList.add("searchHide");
    }
  }

  if (matchNo === 0) {
    searchFail.classList.remove("searchHide");
  }
}
search.addEventListener("keyup", () => {
  searchBooks();
});

module.exports = { searchBooks };
