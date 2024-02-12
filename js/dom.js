const addBook = () => {
  const titleInput = document.getElementById("inputBookTitle");
  const authorInput = document.getElementById("inputBookAuthor");
  const yearInput = document.getElementById("inputBookYear");
  const isCompleteInput = document.getElementById("inputBookIsComplete");

  const title = titleInput.value;
  const author = authorInput.value;
  const year = yearInput.value;
  const isComplete = isCompleteInput.checked;

  if (title && author && year) {
    const object = {
      id: +new Date(),
      title: title,
      author: author,
      year: Number(year),
      isComplete: isComplete,
    };

    books.push(object);
    document.dispatchEvent(new Event(RENDER_EVENT));
    updateDataFromStorage();

    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteInput.checked = false;
  } else {
    alert("Mohon isi semua detail buku.");
  }
};

const editBook = (bookId) => {
  const bookIndex = findBookIndex(bookId);

  if (bookIndex !== -1) {
    const editedBook = books[bookIndex];

    const newTitle = prompt("Masukkan judul baru:", editedBook.title);
    const newAuthor = prompt("Masukkan penulis baru:", editedBook.author);
    const newYear = prompt("Masukkan tahun baru:", editedBook.year);
    const newisComplete = confirm("Apakah buku sudah selesai dibaca?");

    if (newTitle && newAuthor && newYear !== null) {
      editedBook.title = newTitle;
      editedBook.author = newAuthor;
      editedBook.year = Number(newYear);
      editedBook.isComplete = newisComplete;

      document.dispatchEvent(new Event(RENDER_EVENT));
      updateDataFromStorage();
    } else {
      alert("Pengeditan buku dibatalkan. Pastikan mengisi semua detail buku.");
    }
  } else {
    alert("Buku tidak ditemukan.");
  }
};

const makeBook = (book) => {
  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");
  bookItem.innerHTML = "";

  if (book.isComplete) {
    bookItem.innerHTML = `
    <div>
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
    </div>

    <div class="action">
        <button class="green" onclick="moveToUnCompleted(${book.id})">Belum dibaca</button>
        <button class="blue" onclick="editBook(${book.id})">Edit</button>
        <button class="red" onclick="removeBookFromBookshelf(${book.id})">Hapus buku</button>
    </div>
            `;
  } else {
    bookItem.innerHTML = `
    <div>
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
    </div>

    <div class="action">
        <button class="green" onclick="moveToCompleted(${book.id})">Selesai dibaca</button>
        <button class="blue" onclick="editBook(${book.id})">Edit</button>
        <button class="red" onclick="removeBookFromBookshelf(${book.id})">Hapus buku</button>
    </div>
            `;
  }

  return bookItem;
};

const countBookshelf = () => {
  let complete = [];
  let incomplete = [];

  books.filter((book) => {
    if (book.isComplete === true) {
      complete.push(book);
    } else {
      incomplete.push(book);
    }
  });

  document.getElementById("countAllBook").innerText = books.length;
  document.getElementById("countComplete").innerText = complete.length++;
  document.getElementById("countInComplete").innerText = incomplete.length++;
};

const moveToCompleted = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  updateDataFromStorage();
};

const moveToUnCompleted = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  updateDataFromStorage();
};

const removeBookFromBookshelf = (bookId) => {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  const confirmDelete = confirm("Apakah Anda yakin ingin menghapus buku ini?");

  if (confirmDelete) {
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    updateDataFromStorage();
  }
};

const searchBook = (string) => {
  const incompleteBookshelf = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelf = document.getElementById("completeBookshelfList");
  let foundIncomplete = false;
  let foundComplete = false;

  for (const item of incompleteBookshelf.querySelectorAll(".book_item")) {
    const title = item.childNodes[1];

    if (title.innerText.toUpperCase().includes(string)) {
      title.parentElement.style.display = "";
      foundIncomplete = true;
    } else {
      title.parentElement.style.display = "none";
    }
  }

  for (const item of completeBookshelf.querySelectorAll(".book_item")) {
    const title = item.childNodes[1];

    if (title.innerText.toUpperCase().includes(string)) {
      title.parentElement.style.display = "";
      foundComplete = true;
    } else {
      title.parentElement.style.display = "none";
    }
  }
  if (string === "") {
    resetBookshelf(incompleteBookshelf);
    resetBookshelf(completeBookshelf);
  } else {
    handleNoResults(foundIncomplete, foundComplete);
  }
};

const handleNoResults = (foundIncomplete, foundComplete) => {
  const noResultMessage = document.createElement("p");
  noResultMessage.textContent = "Maaf buku yang Anda cari tidak ada.";

  const incompleteBookshelf = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelf = document.getElementById("completeBookshelfList");

  incompleteBookshelf.innerHTML = "";
  completeBookshelf.innerHTML = "";

  if (!foundIncomplete) {
    incompleteBookshelf.appendChild(noResultMessage.cloneNode(true));
  }

  if (!foundComplete) {
    completeBookshelf.appendChild(noResultMessage);
  }
};

const resetBookshelf = (bookshelf) => {
  bookshelf.innerHTML = "";
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const filterBook = (e) => {
  const bookshelfItem = document.querySelectorAll(".book_list");
  for (const bookshelf of bookshelfItem) {
    if (e == "all") {
      bookshelf.style.display = "";
      bookshelf.classList.remove("bookshelfByFilter");
    } else if (e == bookshelf.id) {
      bookshelf.style.display = "";
      bookshelf.classList.add("bookshelfByFilter");
    } else {
      bookshelf.style.display = "none";
    }
  }
};

const filters = document.querySelectorAll(".filter_book");
for (const filter of filters) {
  filter.addEventListener("click", () => {
    const active = document.querySelectorAll(".filter_active");
    for (const item of active) {
      item.className = item.className.replace("filter_active", "");
    }
    filter.classList.add("filter_active");
  });
}
