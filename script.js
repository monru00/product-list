const cardGrid = document.querySelector(".card-grid");
const confirmOrderBtn = document.querySelector(".confirm-order-btn");
const overlay = document.querySelector(".overlay");
const orderConfirmedContainer = document.querySelector(
  ".order-confirmed-container"
);
const startNewOrderBtn = document.querySelector(".start-new-order-btn");
const counterBtns = document.querySelectorAll(".counter-btn");
const yourCartItemsContainer = document.querySelector(
  ".your-cart-items-container"
);
const numberOfCartItems = document.querySelector(".number-of-cart-items");
const yourCartContainer = document.querySelector(".your-cart-container");
const yourCartContainerFull = document.querySelector(
  ".your-cart-container-full"
);
const yourCartContainerEmpty = document.querySelector(
  ".your-cart-container-empty"
);
const totalBill = document.querySelector(".total-bill");
const confirmedCartItemContainer = document.querySelector(
  ".confirmed-cart-item-container"
);
const confirmedTotalBill = document.querySelector(".confirmed-total-bill");

let dataArray = [];
let cart = [];

const fetchData = async () => {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    dataArray.push(...data);
  } catch {
    console.error("Error:", error);
  }
  dataArray.forEach((item, index) => {
    item.id = index + 1;
    item.numberOfUnits = 1;
  });
  const displayCards = () => {
    dataArray.map((item) => {
      cardGrid.innerHTML += `<div class="card">
              <picture >
                <source
                  media="(max-width: 768px)"
                  srcset="${item.image.mobile}"
                />
                <source
                  media="(max-width: 900px)"
                  srcset="${item.image.tablet}"
                />
                <source
                  media="(max-width: 1000px)"
                  srcset="${item.image.desktop}"
                />
                <img src="${item.image.desktop}"   alt="${item.name}"/>
                
              </picture>
              <div class="btn-container">
                <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                  <img src="assets/images/icon-add-to-cart.svg" alt="" />Add to
                  Cart
                </button>
                <button class="counter-btn">
                  <img
                    src="assets/images/icon-decrement-quantity.svg"
                    alt=""
                    class="decrement-btn" onclick="changeNumberOfUnits('minus', ${
                      item.id
                    })"
                  />
                  <h5 class="display-count">${item.numberOfUnits}</h5>
                  <img
                    src="assets/images/icon-increment-quantity.svg"
                    alt=""
                    class="increment-btn" onclick="changeNumberOfUnits('plus', ${
                      item.id
                    })"
                  />
                </button>
              </div>
              <h2 class="category">${item.category}</h2>
              <h3 class="name">${item.name}</h3>
              <h4 class="price">$${item.price.toFixed(2)}</h4>
            </div>`;
    });
  };
  displayCards();
};

fetchData();
const addToCart = (id) => {
  const thisItem = dataArray[id - 1];

  cart.push({ ...thisItem });

  const addToCartBtns = [...document.querySelectorAll(".add-to-cart-btn")];
  addToCartBtns.forEach((addToCartBtn) => {
    const thisBtnIndex = addToCartBtns.indexOf(addToCartBtn) + 1;
    if (thisBtnIndex === id) {
      addToCartBtn.style.visibility = "hidden";
      addToCartBtn.nextElementSibling.style.visibility = "visible";
      addToCartBtn.parentElement.previousElementSibling.children[3].classList.add(
        "outline"
      );
    }
  });
  updateCart();
};

const updateCart = () => {
  renderCartItems();
  renderTotals();
};

const renderCartItems = () => {
  document.querySelector(".your-cart-container-empty").style.display = "none";
  document.querySelector(".your-cart-container-full").style.display = "block";

  yourCartItemsContainer.innerHTML = "";
  cart.map((item) => {
    yourCartItemsContainer.innerHTML += `
    <div class="your-cart-wrapper">
              <div class="your-cart-content">
                <p class="your-cart-name">${item.name}</p>
                <div class="your-cart-count">
                  <p class="number-of-this-item">${item.numberOfUnits}</p>
                <p class="x">x</p>
                  <p>
                    @ $<span class="price-for-one">${item.price.toFixed(
                      2
                    )}</span>
                    <span class="price-total-for-multiples">$${(
                      item.price * item.numberOfUnits
                    ).toFixed(2)}</span>
                  </p>
                </div>
              </div>
              <img
                src="assets/images/icon-remove-item.svg"
                alt=""
                class="remove-btn" onclick="removeItemFromCart(${item.id})"
              />
            </div>
            `;
  });
};

const changeNumberOfUnits = (action, id) => {
  cart = cart.map((item) => {
    let numberOfUnits = item.numberOfUnits;
    if (item.id === id) {
      if (action === "minus" && numberOfUnits > 1) {
        numberOfUnits--;
      } else if (action === "plus") {
        numberOfUnits++;
      }
    }

    return { ...item, numberOfUnits };
  });

  updateCart();
  dataArray = dataArray.map((item) => {
    numberOfUnits = item.numberOfUnits;

    if (item.id === id) {
      if (action === "minus" && numberOfUnits > 1) {
        numberOfUnits--;
      } else if (action === "plus") {
        numberOfUnits++;
      }
    }
    return { ...item, numberOfUnits };
  });

  let displayCounts = [...document.querySelectorAll(".display-count")];
  const thisItem = id - 1;
  const displayThis = displayCounts[thisItem];
  thisNumberOfUnits = dataArray[thisItem].numberOfUnits;
  displayThis.innerHTML = `${thisNumberOfUnits}`;
};

const renderTotals = () => {
  let totalPrice = 0;
  let totalUnits = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
    totalUnits += item.numberOfUnits;

    numberOfCartItems.innerHTML = totalUnits;
    totalBill.innerHTML = `$${totalPrice.toFixed(2)}`;
    confirmedTotalBill.innerHTML = `$${totalPrice.toFixed(2)}`;
  });
};

const removeItemFromCart = (id) => {
  cart = cart.filter((item) => item.id !== id);

  updateCart();

  if (cart.length === 0) {
    document.querySelector(".your-cart-container-empty").style.display =
      "block";
    document.querySelector(".your-cart-container-full").style.display = "none";

    numberOfCartItems.innerHTML = 0;
  }
};

confirmOrderBtn.addEventListener("click", () => {
  overlay.style.display = "block";
  orderConfirmedContainer.style.display = "block";
  window.scrollTo(4, 0); //! top, left
  confirmedCartItemContainer.innerHTML = "";
  cart.map((item) => {
    confirmedCartItemContainer.innerHTML += `<div class="confirmed-cart-item">
            <div class="confirmed-left">
              <img src="${item.image.thumbnail}" alt="" />
              <div class="confirmed-content">
                <div class="confirmed-name">${item.name}</div>
                <div class="confirmed-unit-container">
                  <p class="number-of-this-item">${item.numberOfUnits}</p>
                  <p class="x">x</p>
                  <p class="and">@ <span class="price-for-one">$${item.price.toFixed(
                    2
                  )}</span></p>
                </div>
              </div>
            </div>
            <div class="confirmed-total-price">$${(
              item.price * item.numberOfUnits
            ).toFixed(2)}</div>
          </div>`;
  });
});

startNewOrderBtn.addEventListener("click", () => {
  overlay.style.display = "none";

  numberOfCartItems.innerHTML = 0;
  totalBill.innerHTML = 0;
  cart = [];
  updateCart();
  orderConfirmedContainer.style.display = "none";
  yourCartContainerFull.style.display = "none";
  yourCartContainerEmpty.style.display = "block";

  const addToCartBtns = [...document.querySelectorAll(".add-to-cart-btn")];
  addToCartBtns.forEach((addToCartBtn) => {
    addToCartBtn.style.visibility = "visible";
    addToCartBtn.nextElementSibling.style.visibility = "hidden";
    addToCartBtn.parentElement.previousElementSibling.children[3].classList.remove(
      "outline"
    );
    const displayCounts = document.querySelectorAll(".display-count");
    displayCounts.forEach((count) => {
      count.innerHTML = 1;
    });
    dataArray.forEach((item) => {
      item.numberOfUnits = 1;
    });
    console.log(dataArray);
  });
});
