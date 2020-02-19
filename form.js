class Form {
  constructor(elem) {
    this.elem = elem;
    elem.onclick = this.onClick.bind(this);

    this.form = document.createElement("form");

    this.div = document.createElement("div");
    this.div.innerHTML = "<p>Изображения для описания товара</p>";

    this.input = document.createElement("input");
    this.input.type = "file";
    this.input.id = "fileElem";
    this.input.multiple = true;
    this.input.accept = "image/jpeg,image/png,image/jpg";
    this.input.onchange = this.handleFiles;
    this.input.style = "display:none";

    this.label = document.createElement("label");
    this.label.className = "add-button";
    this.label.htmlFor = "fileElem";
    this.label.innerText = "Добавить еще";

    this.button = document.createElement("button");
    this.button.className = "submit";
    this.button.innerText = "Сохранить";
    this.button.formAction = "#";

    this.gallery = document.createElement("div");
    this.gallery.id = "gallery";

    this.form.appendChild(this.div);
    this.form.appendChild(this.gallery);
    this.form.appendChild(this.input);
    this.form.appendChild(this.label);
    this.form.appendChild(this.button);

    this.elem.appendChild(this.form);
  }

  deleteImg() {
    let imgSrc = JSON.stringify(event.target.parentNode.lastElementChild.src);

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);

      if (imgSrc === localStorage.getItem(key)) {
        localStorage.removeItem(`${key}`);
      }
    }

    event.target.parentNode.remove();
  }

  handleFiles() {
    let files = this.files;

    files = [...files];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      const fileTypes = ["image/jpeg", "image/jpg", "image/png"];

      function validFileType(file) {
        return fileTypes.includes(file.type);
      }

      if (validFileType(file) && file.size < 20971520) {
        let curImg = `image${localStorage.length + i}`;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
          let img = document.createElement("img");

          img.src = reader.result;

          let container = document.createElement("div");
          container.className = "container";
          container.innerHTML = `
                    <div>
                      <span class="close-image-icon" data-action="deleteImg">&otimes;</span>
                      <img class="img-thumbnail" src="${img.src}" style="height: 100px">
                  </div>`;

          document.getElementById("gallery").appendChild(container);

          localStorage.setItem(`${curImg}`, JSON.stringify(reader.result));
        };
      }
    }
  }

  render() {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.hasOwnProperty(`image${i}`)) {
        let img = document.createElement("img");
        let returnObj = JSON.parse(localStorage.getItem(`image${i}`));

        img.src = returnObj;

        let container = document.createElement("div");
        container.className = "container";
        container.innerHTML = `
                    <div>
                      <span class="close-image-icon" data-action="deleteImg">&otimes;</span>
                      <img class="img-thumbnail" src="${img.src}" style="height: 100px">
                  </div>`;

        document.getElementById("gallery").appendChild(container);
      }
    }
  }

  onClick(event) {
    let action = event.target.dataset.action;
    if (action) {
      this[action]();
    }
  }
}
