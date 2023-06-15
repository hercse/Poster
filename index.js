// Constants
const apiKey = "AIzaSyDx9l2u11YUgI_XZ7KB3n0v7yvvN_ERhCk";
const defaultSheetName = "All";
const fetchUrl =
  "https://sheets.googleapis.com/v4/spreadsheets/1BIkOb8FONBsS8i_9HLEoHOuFUaEJicn9YlsTs8pvwZw/values/";

function createPosterTemplate(i, isChecked, index) {
  return `<label>
  <input type="checkbox" class="" ${isChecked}a />
  <img src="https://drive.google.com/uc?id=${i[3]}" alt="" />
  <div class="">
    <div class="title">${i[0]}</div>
    <div class="date">${i[2]}</div>
    <div class="info">${i[1]}</div>
  </div>
</label>`;
}

var posterlist;
var output;

// DOM elements
var searchInput = document.getElementById("search-input");
var selectAllCheckbox = document.getElementById("select-all-checkbox");
var posterlistSection = document.querySelector("section.posterlist");

// 檢查 URL query string 以獲取 sheet 名稱
function getSheetNameFromQueryString() {
  const urlParams = new URLSearchParams(window.location.search);
  const sheetName = urlParams.get("sheet") || "";
  return sheetName !== "" ? sheetName : defaultSheetName;
}

const sheetName = getSheetNameFromQueryString();
const completeFetchUrl = `${fetchUrl}${sheetName}?alt=json&key=${apiKey}`;

fetch(completeFetchUrl)
  .then((res) => res.json())
  .then((res) => {
    console.log(res.values);
    posterlist = res.values;
    displayPosters(posterlist.slice(1), "");

    // Get the search term from the query string and display filtered results
    const searchTerm = getSearchTermFromQueryString();
    filterAndDisplayPosters(searchTerm);

    // 為搜尋欄位添加事件監聽器
    searchInput.addEventListener("input", handleSearchInput);
  });

// 當頁面加載時，並沒有調用QueryString並出現搜尋結果
function getSearchTermFromQueryString() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("search") || "";
}

// 新函數：從 query string 獲取 patch
function getPatchFromQueryString() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("patch") || "";
}
function filterAndDisplayPosters(searchTerm) {
  const patchFilter = getPatchFromQueryString();

  if (searchTerm === "" && patchFilter === "") {
    displayPosters(posterlist.slice(1), "");
  } else {
    searchInput.value = searchTerm;
    const filteredPosterList = posterlist.slice(1).filter((poster) => {
      const titleMatch = poster[0]
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const patchMatch =
        patchFilter === "" ? true : poster[6].includes(patchFilter);
      return titleMatch && patchMatch;
    });
    displayPosters(filteredPosterList, searchTerm);
  }
}

function updateQueryString(searchTerm) {
  if (searchTerm) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("search", searchTerm);
    window.history.pushState(null, "", newUrl.toString());
  } else {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("search");
    window.history.pushState(null, "", newUrl.toString());
  }
}

function handleSearchInput(event) {
  const searchTerm = event.target.value;
  updateQueryString(searchTerm);

  if (searchTerm === "") {
    // 如果搜尋欄位是空的，則顯示所有 posters
    displayPosters(posterlist.slice(1), "");
  } else {
    const filteredPosterList = posterlist
      .slice(1)
      .filter((poster) =>
        poster[0].toLowerCase().includes(searchTerm.toLowerCase())
      );
    displayPosters(filteredPosterList, searchTerm);
  }
}

// function displayPosters(posterList, searchTerm) {
//   posterlistSection.innerHTML = "";
//   posterList.forEach((i) => {
//     let isChecked = "";

//     if (searchTerm !== "") {
//       const regExpChars = /[.*+\-?^${}()|[\]\\]/g;
//       const escapedSearchTerm = searchTerm.replace(regExpChars, "\\$&");
//       const regex = new RegExp(escapedSearchTerm, "gi");

//       if (i[0].match(regex)) {
//         isChecked = "checked";
//       }
//     }

//     output = createPosterTemplate(i, isChecked);
//     wirtein();
//   });
// }

// 反轉後

function displayPosters(posterList, searchTerm) {
  posterlistSection.innerHTML = "";

  // 反向排列 posterList
  const reversedPosterList = posterList.slice().reverse();

  reversedPosterList.forEach((i) => {
    let isChecked = "";

    if (searchTerm !== "") {
      const regExpChars = /[.*+\-?^${}()|[\]\\]/g;
      const escapedSearchTerm = searchTerm.replace(regExpChars, "\\$&");
      const regex = new RegExp(escapedSearchTerm, "gi");

      if (i[0].match(regex)) {
        isChecked = "checked";
      }
    }

    output = createPosterTemplate(i, isChecked);
    wirtein();
  });
}

function wirtein() {
  posterlistSection.innerHTML += output;
}

// 為全選框添加事件監聽器
selectAllCheckbox.addEventListener("change", (event) => {
  const selectAllChecked = event.target.checked;
  toggleAllCheckboxes(selectAllChecked);
});

function toggleAllCheckboxes(selectAllChecked) {
  // 選擇或取消選擇所有 section.posterlist 中的 checkboxes
  const allCheckboxes = posterlistSection.querySelectorAll(
    "input[type=checkbox]"
  );
  allCheckboxes.forEach((checkbox) => {
    checkbox.checked = selectAllChecked;
  });
}
