// ======= Cart & History =======
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

const cartList = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const searchInput = document.getElementById("search");

// ======= Admin Login =======
let isAdmin = false;
const password = "1234";

document.querySelectorAll(".edit-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!isAdmin) {
      const input = prompt("Enter admin password:");
      if (input === password) {
        isAdmin = true;
      } else {
        alert("Wrong password!");
        return;
      }
    }
    const product = btn.closest(".product");
    editProduct(product);
  });
});

// ======= Add to Cart =======
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price, quantity: 1 });
  updateCart();
  saveCart();
}

// ======= Update Cart =======
function updateCart() {
  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = "<li>No items yet</li>";
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.quantity}
      <button onclick="cart[${index}].quantity++;updateCart()">+</button>
      <button onclick="cart[${index}].quantity--;if(cart[${index}].quantity<1)cart[${index}].quantity=1;updateCart()">-</button>
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartList.appendChild(li);
  });

  totalText.innerText = `Total: ${total} TZS`;
}

// ======= Save Cart =======
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ======= Remove Item =======
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

// ======= Search Products =======
searchInput.addEventListener("keyup", (e) => {
  document.querySelectorAll(".product").forEach(p => {
    p.style.display = p.innerText.toLowerCase().includes(e.target.value.toLowerCase()) ? "block" : "none";
  });
});

// ======= Edit Product (Admin) =======
function editProduct(product) {
  const name = product.querySelector("h3");
  const price = product.querySelector(".price");

  const newName = prompt("New name:", name.innerText);
  const newPrice = prompt("New price:", price.dataset.price);

  if (newName) name.innerText = newName;
  if (newPrice) {
    price.dataset.price = newPrice;
    price.innerText = `TZS ${newPrice}`;
  }
}

// ======= Checkout =======
document.getElementById("checkout-btn").onclick = () => {
  if (cart.length === 0) return alert("Cart empty!");
  document.getElementById("checkout").style.display = "block";
};

// ======= Confirm Order =======
document.getElementById("confirm-order").onclick = () => {
  history.push([...cart]);
  localStorage.setItem("history", JSON.stringify(history));
  cart = [];
  saveCart();
  updateCart();
  showHistory();
  alert("Order placed!");
};

// ======= Show Order History =======
function showHistory() {
  const list = document.getElementById("order-history");
  list.innerHTML = "";

  history.forEach(order => {
    const li = document.createElement("li");
    li.innerText = order.map(i => `${i.name} x${i.quantity}`).join(", ");
    list.appendChild(li);
  });
}

showHistory();

// ======= Add to Cart Buttons =======
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.onclick = () => {
    const product = btn.closest(".product");
    const name = product.querySelector("h3").innerText;
    const price = parseInt(product.querySelector(".price").dataset.price);
    addToCart(name, price);
  };
});

// ======= WhatsApp Order =======
document.getElementById("order-btn").onclick = () => {
  if (cart.length === 0) return alert("Cart empty!");
  let total = 0;
  let msg = "Order:\n";
  cart.forEach(i => {
    msg += `${i.name} x${i.quantity}\n`;
    total += i.price * i.quantity;
  });
  msg += `Total: ${total} TZS`;
  window.open(`https://wa.me/255699059787?text=${encodeURIComponent(msg)}`);
};

// ======= Clear Cart =======
document.getElementById("clear-cart").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart is already empty!");
    return;
  }

  if (confirm("Are you sure you want to clear the cart?")) {
    cart = [];
    saveCart();
    updateCart();
  }
});

// ======= Contact Form Validation =======
document.getElementById("contact-form").addEventListener("submit", function(e){
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const errorDiv = document.getElementById("form-error");
  errorDiv.innerText = "";

  if(name.length < 3){
    errorDiv.innerText = "Name must be at least 3 characters";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    errorDiv.innerText = "Enter a valid email";
    return;
  }

  if(message.length < 5){
    errorDiv.innerText = "Message must be at least 5 characters";
    return;
  }

  alert("Message sent successfully!");
  this.reset();
});