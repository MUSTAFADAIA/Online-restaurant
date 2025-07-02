let menu = document.querySelector("#menu-bar");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
};

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  document.getElementById("cart-count").textContent = count;
}
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.dataset.price = item.price;

    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <div class="quantity">
        <label>Qty:</label>
        <input type="number" value="${
          item.qty
        }" min="1" class="qty-input" data-index="${index}" />
      </div>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;

    cartContainer.appendChild(itemEl);
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "total";
  totalDiv.id = "total";
  totalDiv.textContent = `Total: $${total.toFixed(2)}`;
  cartContainer.appendChild(totalDiv);

  updateCartCount();

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      location.reload();
    });
  });

  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = input.dataset.index;
      const newQty = parseInt(input.value);
      cart[index].qty = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      location.reload();
    });
  });
});

///////////////////////
function updateTotal() {
  const items = document.querySelectorAll(".cart-item");
  let total = 0;
  let count = 0;

  items.forEach((item) => {
    const price = parseFloat(item.getAttribute("data-price"));
    const qty = parseInt(item.querySelector(".qty-input").value);
    total += price * qty;
    count += qty;
  });

  document.getElementById("total").textContent = `Total: $${total.toFixed(2)}`;
  document.getElementById("cart-count").textContent = count;
  localStorage.setItem("cartCount", count);
}

function setupCart() {
  document.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", updateTotal);
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".cart-item").remove();
      updateTotal();
    });
  });

  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const cardForm = document.getElementById("card-form");

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (document.getElementById("card").checked) {
        cardForm.style.display = "block";
      } else {
        cardForm.style.display = "none";
      }
    });
  });

  updateTotal();
}

document.addEventListener("DOMContentLoaded", setupCart);

function submitOrder() {
  const selectedPayment = document.querySelector(
    'input[name="payment"]:checked'
  );
  if (!selectedPayment) {
    alert("Please select a payment method.");
    return;
  }

  if (selectedPayment.value === "card") {
    const inputs = document.querySelectorAll("#card-form input");
    for (let input of inputs) {
      if (!input.value.trim()) {
        alert("Please fill in your card details.");
        return;
      }
    }
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("The basket is empty.");
    return;
  }

  const orderData = {
    items: cart.map((item) => ({
      name: item.name,
      quantity: item.qty,
      price: item.price,
    })),
    paymentMethod: selectedPayment.value,
  };

  if (selectedPayment.value === "card") {
    orderData.name = document.getElementById("card-name").value;
    orderData.cardNumber = document.getElementById("card-number").value;
    orderData.expirydate = new Date(
      document.getElementById("card-expiry").value
    ).toISOString();
    orderData.cvv = document.getElementById("card-cvv").value;
  }

  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/v2/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        localStorage.removeItem("cart");
        updateCartCount();

        const cartContainer = document.getElementById("cart");
        if (cartContainer) {
          cartContainer.innerHTML = "<p>Your cart is empty.</p>";
          const totalEl = document.getElementById("total");
          if (totalEl) totalEl.textContent = "Total: $0.00";
        }

        document.getElementById("success-modal").style.display = "block";
      } else {
        alert("Failed to send request:" + data.message);
      }
    })
    .catch((err) => {
      alert("An error occurred while submitting the request:" + err.message);
    });
}

function closeModal() {
  document.getElementById("success-modal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("success-modal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.querySelector(".logout-link")?.addEventListener("click", function () {
  localStorage.removeItem("cartCount");
  localStorage.removeItem("id");
  localStorage.removeItem("cart");

  updateCartCount();
});

async function fetchCategories() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    const response = await fetch("http://localhost:5000/api/v2/products", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error("Download failed:" + errText);
    }

    const result = await response.json();
    const products = result.data;
    const container = document.getElementById("category-container");

    products.forEach((product) => {
      const box = document.createElement("div");
      box.classList.add("box");

      const imageUrl = product.images[0] || "image/default.jpg";
      const title = product.title;
      const price = product.price;

      box.innerHTML = `
          <span class="price">$${price}</span>
          <img src="${imageUrl}" alt="${title}" />
          <h3>${title}</h3>
          <div class="stars">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i>
          </div>
          <button class="btn add-to-cart" 
            data-name="${title}" 
            data-image="${imageUrl}" 
            data-price="${price}">order now</button>
        `;

      container.appendChild(box);
    });

    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const image = btn.dataset.image;
        const price = parseFloat(btn.dataset.price);

        const item = { name, image, price, qty: 1 };
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find((p) => p.name === name);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push(item);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        document.getElementById("cart-count").innerText = cart.length;
      });
    });
  } catch (error) {
    console.error("Failed to load products:", error.message);
  }
}

window.addEventListener("DOMContentLoaded", fetchCategories);
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
}

document.addEventListener("DOMContentLoaded", updateCartCount);
