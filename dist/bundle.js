(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toESM = (module, isNodeMode) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
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

  // src/view.ts
  function saveUrlWithRootAndSort(rootValue, sortValue) {
    const currentUrl = new URL(window.location.href);
    const newUrl = new URL(`${currentUrl.protocol}//${currentUrl.hostname}${currentUrl.port ? ":" + currentUrl.port : ""}`);
    newUrl.pathname = "./files";
    newUrl.searchParams.set("root", rootValue);
    newUrl.searchParams.set("sort", sortValue);
    const urlString = newUrl.toString();
    return urlString;
  }
  function drawelapsedtime(param) {
    const elapsedtimeId = document.getElementById("btn-elapsedtime");
    if (elapsedtimeId) {
      elapsedtimeId.textContent = "Elased: " + param;
    }
  }
  function drawpathName(param) {
    const elapsedtimeId = document.getElementById("pathName");
    if (elapsedtimeId) {
      elapsedtimeId.textContent = "PathName: " + param;
    }
  }
  function drawTable(data) {
    const tableBody = document.getElementById("filesTable");
    if (!tableBody)
      return;
    tableBody.innerHTML = "";
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const typeHeader = document.createElement("th");
    typeHeader.textContent = "Type";
    headerRow.appendChild(typeHeader);
    const directoryPathNameHeader = document.createElement("th");
    directoryPathNameHeader.textContent = "Directory Path Name";
    headerRow.appendChild(directoryPathNameHeader);
    const sizeHeader = document.createElement("th");
    sizeHeader.textContent = "Size";
    headerRow.appendChild(sizeHeader);
    const kindHeader = document.createElement("th");
    kindHeader.textContent = "Kind";
    headerRow.appendChild(kindHeader);
    thead.appendChild(headerRow);
    tableBody.appendChild(thead);
    data.forEach((item) => {
      const row = document.createElement("tr");
      const typefileCell = document.createElement("td");
      typefileCell.textContent = item.typefile;
      row.appendChild(typefileCell);
      const filenameCell = document.createElement("td");
      filenameCell.textContent = item.filename;
      row.appendChild(filenameCell);
      const sizeInMBCell = document.createElement("td");
      sizeInMBCell.textContent = item.sizeInMB + " MB";
      row.appendChild(sizeInMBCell);
      const folderCell = document.createElement("td");
      folderCell.textContent = item.folder;
      row.appendChild(folderCell);
      tableBody.appendChild(row);
    });
  }
  function styleLoadingMessage(message) {
    message.style.fontSize = "1.5em";
    message.style.position = "absolute";
    message.style.top = "0";
    message.style.left = "0";
    message.style.width = "100%";
    message.style.textAlign = "center";
    message.style.padding = "10px";
    message.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    message.style.borderRadius = "5px";
    message.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    message.style.color = "blue";
  }
  function removeParag() {
    const existingLoadingMessages = document.querySelectorAll("p");
    existingLoadingMessages.forEach((message) => {
      if (message.textContent === "Loading...") {
        message.remove();
      }
    });
  }
  var init_view = __esm({
    "src/view.ts"() {
    }
  });

  // src/model.ts
  function getJson(url) {
    return __async(this, null, function* () {
      try {
        const loadingMessage = document.createElement("p");
        loadingMessage.textContent = "Loading...";
        styleLoadingMessage(loadingMessage);
        document.body.appendChild(loadingMessage);
        const response = yield fetch(url);
        const data = response.json();
        loadingMessage.style.display = "none";
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    });
  }
  function moveBackFromRoot(path) {
    const parts = path.split("/");
    parts.pop();
    const newPath = parts.join("/");
    return newPath;
  }
  function getSort() {
    const url = new URL(window.location.href);
    return url.searchParams.get("sort") || "";
  }
  var File, params;
  var init_model = __esm({
    "src/model.ts"() {
      init_view();
      File = class {
        constructor(typefile, filename, sizeInMB, siseInbytes, folder) {
          this.typefile = typefile;
          this.filename = filename;
          this.sizeInMB = sizeInMB;
          this.sizeInBytes = siseInbytes;
          this.folder = folder;
        }
      };
      params = class {
        constructor(root, sort) {
          this.root = root;
          this.sort = sort;
        }
      };
    }
  });

  // src/controller.ts
  var require_controller = __commonJS({
    "src/controller.ts"(exports) {
      init_model();
      init_view();
      var url = new URL(window.location.href);
      url.pathname += "./files";
      var urlString = url.toString();
      document.addEventListener("DOMContentLoaded", () => __async(exports, null, function* () {
        removeParag();
        const data = yield getJson(urlString);
        drawTable(data.Files);
        drawpathName(data.pathName);
        drawelapsedtime(data.elapsedtime);
      }));
      var table = document.getElementById("filesTable");
      table.addEventListener("click", (event) => {
        removeParag();
        const rowData = handleCellClick(event);
        if (rowData) {
          if (rowData[0] == "\u041A\u0430\u0442\u0430\u043B\u043E\u0433") {
            let link = saveUrlWithRootAndSort(rowData[1], getSort());
            getJson(link).then((data) => {
              drawTable(data.Files);
              drawpathName(data.pathName);
              drawelapsedtime(data.elapsedtime);
            }).catch((error) => {
              console.error("Error fetching JSON data:", error);
            });
          }
        }
      });
      function handleCellClick(event) {
        const target = event.target;
        if (target.tagName === "TD") {
          const row = target.parentNode;
          const rowData = Array.from(row.cells).map((cell) => cell.innerText);
          return rowData;
        }
        return null;
      }
      var button = document.getElementById("moveBackButton");
      button.addEventListener("click", () => {
        removeParag();
        const currentRootElement = document.getElementById("pathName");
        const currentRoot = currentRootElement.textContent || "";
        if (currentRoot !== null) {
          let newRoot = moveBackFromRoot(currentRoot);
          currentRootElement.textContent = newRoot;
          newRoot = newRoot.replace("PathName: ", "");
          let link = saveUrlWithRootAndSort(newRoot, getSort());
          getJson(link).then((data) => {
            drawTable(data.Files);
            drawpathName(data.pathName);
            drawelapsedtime(data.elapsedtime);
          }).catch((error) => {
            console.error("Error fetching JSON data:", error);
          });
        }
      });
    }
  });

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    File: () => File,
    drawTable: () => drawTable,
    drawelapsedtime: () => drawelapsedtime,
    drawpathName: () => drawpathName,
    getJson: () => getJson,
    getSort: () => getSort,
    moveBackFromRoot: () => moveBackFromRoot,
    params: () => params,
    removeParag: () => removeParag,
    saveUrlWithRootAndSort: () => saveUrlWithRootAndSort,
    styleLoadingMessage: () => styleLoadingMessage
  });
  __reExport(src_exports, __toESM(require_controller()));
  init_model();
  init_view();
})();
//# sourceMappingURL=bundle.js.map
