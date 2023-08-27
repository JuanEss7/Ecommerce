const url = "https://apiproducts-2w26.onrender.com/products";
let sectionProducts = document.querySelector(".products");
let modal = document.querySelector(".modal");
let modal_p = document.querySelector(".modal-p");
let open_car = document.querySelector(".icon");
let close_car = document.querySelector(".modal-btn");
let count = 0;

async function loadProduct() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    products(data);
    if (!res.ok) {
      throw {
        status: res.status,
        statusText: res.statusText,
      };
    }
  } catch (err) {
    console.log(err);
    let message = err.statusText || "Ocurrio un error";
    sectionProducts.innerHTML = `<p>${message}</p>`;
  }
}
addEventListener("DOMContentLoaded", () => {
  loadProduct();
});
function products(data) {
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < data.length; i++) {
    let product = data[i];
    let div_product = document.createElement("div");
    let product_img = document.createElement("div");
    let image = document.createElement("img");
    let product_color = document.createElement("div");
    let product_storage = document.createElement("div");
    let name_product = document.createElement("span");
    let product_price = document.createElement("p");
    let btn = document.createElement("button");

    div_product.classList.add("product");
    product_img.classList.add("product-img");
    product_color.classList.add("product-color");
    product_storage.classList.add("product-storage");
    name_product.classList.add("product-title");
    product_price.classList.add("product-price");
    btn.classList.add("product-btn");

    image.setAttribute("src", product.color[0].img);
    name_product.textContent = product.name;
    product_price.textContent = `$${product.price}`;
    btn.textContent = "COMPRAR";

    product.color.map((item) => {
      let color = document.createElement("span");
      color.classList.add("color");
      color.style.backgroundColor = item.color;
      color.addEventListener("click", () => setImage(image, item.img));
      product_color.appendChild(color);
    });
    product.storage.map((item) => {
      let storage = document.createElement("span");
      let name = product.name.split(" ").join("");
      storage.classList.add("storage");
      storage.classList.add(name);
      storage.textContent = item;
      storage.addEventListener("click", selectStorage);
      product_storage.appendChild(storage);
    });

    product_img.appendChild(image);
    product_img.appendChild(product_color);

    div_product.appendChild(product_img);
    div_product.appendChild(product_storage);
    div_product.appendChild(name_product);
    div_product.appendChild(product_price);
    div_product.appendChild(btn);

    fragment.appendChild(div_product);
    btn.addEventListener("click", () => {
      addCar(div_product);
    });
  }
  sectionProducts.appendChild(fragment);
}
function addCar(product) {
  let stg;
  let img = product.childNodes[0].childNodes[0].src;
  let model = product.childNodes[2].textContent;
  let storage = product.childNodes[1].childNodes;
  let prc = parseInt(product.childNodes[3].textContent.split("$")[1]);
  for (let i of storage) {
    if (i.classList.contains("select")) {
      stg = i.textContent;
    }
  }
  modal_p.appendChild(modalProduct(img, model, stg, prc));
  numberProducts();
  count += prc;
  priceProduct();
}
function setImage(img, src) {
  img.setAttribute("src", src);
}
function selectStorage(e) {
  let select = e.target;
  let storage = e.target.parentElement.childNodes;
  for (let item of storage) {
    item.classList.contains("select") && item.classList.remove("select");
  }
  select.classList.add("select");
}

open_car.addEventListener("click", () => {
  modal.classList.toggle("open");
});
close_car.addEventListener("click", () => {
  modal.classList.toggle("open");
});

function modalProduct(img, product, storage = "128 GB", prc) {
  let ctn = 1;
  let modal_product = document.createElement("div");
  let img_product = document.createElement("img");
  let div_model = document.createElement("div");
  let model = document.createElement("p");
  let stg = document.createElement("span");
  let modal_count = document.createElement("div");
  let btn_bef = document.createElement("button");
  let btn_next = document.createElement("button");
  let btn_delete = document.createElement("button");
  let number = document.createElement("span");

  modal_product.classList.add("modal-product");
  div_model.classList.add("div-model");
  btn_bef.classList.add("btn-bef");
  btn_next.classList.add("btn-next");
  btn_delete.classList.add("btn-delete");
  modal_product.id = modal_p.childNodes.length;
  modal_count.classList.add("modal-count");
  img_product.setAttribute("src", img);

  model.textContent = product;
  stg.textContent = storage;
  number.textContent = ctn;
  btn_bef.innerHTML = `<img src="./public/arrow-left-short.svg">`;
  btn_next.innerHTML = `<img src="./public/arrow-right-short.svg">`;
  btn_delete.innerHTML = `<img src="./public/trash.svg">`;

  div_model.appendChild(model);
  div_model.appendChild(stg);

  modal_count.appendChild(btn_bef);
  modal_count.appendChild(number);
  modal_count.appendChild(btn_next);

  modal_product.appendChild(img_product);
  modal_product.appendChild(div_model);
  modal_product.appendChild(modal_count);
  modal_product.appendChild(btn_delete);

  btn_bef.addEventListener("click", () => {
    if (ctn >= 2) {
      ctn--;
      count -= prc;
    }
    if (ctn <= 0) {
      ctn = 1;
    }
    number.textContent = ctn;
    if (ctn == 1 && modal_p.childNodes.length == 1) {
      count = prc;
    }
    priceProduct();
  });
  btn_next.addEventListener("click", () => {
    ctn++;
    number.textContent = ctn;
    count += prc;
    priceProduct();
  });
  btn_delete.addEventListener("click", (e) => {
    let product = e.target.parentElement.parentElement;
    modal_p.removeChild(product);
    numberProducts();
    count -= prc * ctn;
    if (modal_p.childNodes.length == 0) {
      count = 0;
    }
    priceProduct();
  });
  return modal_product;
}
function priceProduct() {
  let price = document.querySelector(".modal-price");
  price.textContent = `$${count}`;
}
function numberProducts() {
  let item = document.querySelector(".item");
  item.textContent = modal_p.childNodes.length;
}
