document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("inputBook").addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
  });

  document.getElementById("searchBookTitle").addEventListener("input", (e) => {
    const searchString = e.target.value.trim().toUpperCase();
    searchBook(searchString);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const incomplete = document.getElementById("incompleteBookshelfList");
  const complete = document.getElementById("completeBookshelfList");
  incomplete.innerHTML = "";
  complete.innerHTML = "";

  for (const book of books) {
    const bookContent = makeBook(book);
    if (book.isComplete) {
      complete.append(bookContent);
    } else {
      incomplete.append(bookContent);
    }
  }

  countBookshelf();
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
