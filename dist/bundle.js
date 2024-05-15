(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/index.ts
  function drawTable(items) {
    const filesTableBody = document.getElementById("filesTableBody");
    items.forEach((file) => {
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      nameCell.textContent = file.filename;
      const typefileCell = document.createElement("td");
      typefileCell.textContent = file.typefile;
      const sizeInBMCell = document.createElement("td");
      sizeInBMCell.textContent = file.sizeInMB + " MiB";
      const foldeCell = document.createElement("td");
      foldeCell.textContent = file.folder;
      row.appendChild(typefileCell);
      row.appendChild(nameCell);
      row.appendChild(sizeInBMCell);
      row.appendChild(foldeCell);
      if (filesTableBody) {
        filesTableBody.appendChild(row);
      }
    });
  }
  function fetchData(url) {
    return __async(this, null, function* () {
      try {
        const response = yield fetch(url);
        if (!response.ok) {
          throw new Error("");
        }
        console.log("Response OK!");
        const files = yield response.json();
        console.log("Files:", files.Files);
        console.log("Elapsedtime:", files.elapsedtime);
        drawTable(files.Files);
        Drawelapsedtime(files.elapsedtime);
        DrawpathName(files.pathName);
      } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0438 \u0437\u0430\u043F\u0440\u043E\u0441\u0430:", error);
      }
    });
  }
  function navigateBack() {
    const currentUrl = new URL(window.location.href);
    const rootParam = currentUrl.searchParams.get("root");
    if (rootParam) {
      const rootParts = rootParam.split("/");
      rootParts.pop();
      const newRoot = rootParts.join("/");
      currentUrl.searchParams.set("root", newRoot);
      window.location.href = currentUrl.toString();
    }
  }
  function Drawelapsedtime(param) {
    const elapsedtimeId = document.getElementById("btn-elapsedtime");
    if (elapsedtimeId) {
      elapsedtimeId.textContent = "Elased: " + param;
    }
  }
  function DrawpathName(param) {
    const elapsedtimeId = document.getElementById("pathName");
    if (elapsedtimeId) {
      elapsedtimeId.textContent = "PathName: " + param;
    }
  }
  function getJsonDatalink() {
    const url = new URL(window.location.href);
    url.pathname += "./files";
    let newULR = url.toString();
    return newULR;
  }
  document.addEventListener("DOMContentLoaded", () => {
    let newULR = getJsonDatalink();
    fetchData(newULR);
    const backbuttom = document.getElementById("backButton");
    if (backbuttom) {
      backbuttom.addEventListener("click", navigateBack);
    }
  });
  document.addEventListener("readystatechange", () => {
    var state = "";
    if (document.readyState === "loading") {
      state = "Loading";
    } else if (document.readyState === "interactive") {
      state = "Loading...";
    } else if (document.readyState === "complete") {
      state = "Loading......";
    }
    updateProgressBar(state);
  });
  function updateProgressBar(state) {
    const progressBar = document.getElementById("progressBar");
    const progressText = document.createElement("span");
    progressText.textContent = state;
    progressBar.innerHTML = "";
    progressBar.appendChild(progressText);
    if (state === "Loading") {
      progressBar.style.width = "33%";
    } else if (state === "Loading...") {
      progressBar.style.width = "66%";
    } else if (state === "Loading......") {
      progressBar.style.width = "100%";
    }
  }
  function HandleCellClick(event) {
    if (event.target.tagName === "TD") {
      const cellText = event.target.textContent;
      UpadateRoot(cellText);
    }
  }
  var tableName = document.getElementById("filesTable");
  if (tableName) {
    tableName.addEventListener("click", HandleCellClick);
  }
  function UpadateRoot(Celldt) {
    const url = new URL(window.location.href);
    try {
      if (Celldt) {
        url.searchParams.set("root", Celldt);
        window.location.href = url.toString();
      }
    } catch (error) {
      console.error("\u0414\u0430\u043D\u043D\u044B\u0435 \u044F\u0447\u0435\u0439\u043A\u0438 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0442!", error);
    }
  }
})();
//# sourceMappingURL=bundle.js.map
