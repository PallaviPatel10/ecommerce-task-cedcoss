const notifications = [
  {
    title: "Order shipped",
    category: "Order",
    priority: "High",
    message: "Your wireless headphones order has been shipped.",
    time: "2 min ago",
    unread: true,
    pinned: true,
  },
  {
    title: "Flash Sale",
    category: "Sale",
    priority: "High",
    message: "Flash Sale starts in 1 hour. Save up to 45% on electronics.",
    time: "18 min ago",
    unread: true,
    pinned: true,
  },
  {
    title: "Payment confirmed",
    category: "Payment",
    priority: "Medium",
    message: "We received payment for order AM-1048.",
    time: "1 hr ago",
    unread: true,
  },
  {
    title: "Back in stock",
    category: "Restock",
    priority: "Medium",
    message: "The smart kitchen scale on your wishlist is available again.",
    time: "3 hrs ago",
    unread: true,
  },
  {
    title: "Reward unlocked",
    category: "Reward",
    priority: "Low",
    message: "You earned 250 AlertMart reward points from your last purchase.",
    time: "Yesterday",
    unread: false,
  },
];

const demoAlerts = [
  {
    title: "Price dropped",
    category: "Sale",
    priority: "High",
    message: "Bluetooth Speaker price dropped by ₹400 today.",
    time: "Just now",
    unread: true,
  },
  {
    title: "Delivery update",
    category: "Order",
    priority: "Medium",
    message: "Your Sport Sneakers order is packed and ready to dispatch.",
    time: "Just now",
    unread: true,
  },
  {
    title: "Payment reminder",
    category: "Payment",
    priority: "High",
    message: "Complete payment for Pro Laptop before the offer expires.",
    time: "Just now",
    unread: true,
  },
];

const notificationButton = document.querySelector("#notificationButton");
const notificationPanel = document.querySelector("#notificationPanel");
const notificationBadge = document.querySelector("#notificationBadge");
const notificationList = document.querySelector("#notificationList");
const unreadSummary = document.querySelector("#unreadSummary");
const markAllReadButton = document.querySelector("#markAllRead");
const markAllUnreadButton = document.querySelector("#markAllUnread");
const clearAllButton = document.querySelector("#clearAll");
const filterAllButton = document.querySelector("#filterAll");
const filterUnreadButton = document.querySelector("#filterUnread");
const filterReadButton = document.querySelector("#filterRead");
const notificationSearch = document.querySelector("#notificationSearch");
const addDemoAlertButton = document.querySelector("#addDemoAlert");
const notificationFilterButtons = document.querySelectorAll(".panel-filters .filter-button");
const cartButton = document.querySelector(".cart-button");
const cartPanel = document.querySelector("#cartPanel");
const cartSummary = document.querySelector("#cartSummary");
const cartCount = document.querySelector("#cartCount");
const productCartButtons = document.querySelectorAll(".product-cart-button");
const productCards = document.querySelectorAll(".deal-card");
const productSearch = document.querySelector("#productSearch");
const categoryButtons = document.querySelectorAll(".category-button");
const productCountLabel = document.querySelector("#productCountLabel");
const emptyProducts = document.querySelector("#emptyProducts");
const browseOffersButton = document.querySelector("#browseOffers");
const productsSection = document.querySelector("#products");
const cartToast = document.querySelector("#cartToast");
const cartToastText = document.querySelector("#cartToastText");
let currentFilter = "all";
let currentNotificationCategory = "all";
let currentCategory = "all";
let cartItems = Number(cartCount.textContent);
let toastTimer;
let nextDemoAlertIndex = 0;

function getUnreadCount() {
  return notifications.filter((notification) => notification.unread).length;
}

function updateUnreadState() {
  const unreadCount = getUnreadCount();
  const totalCount = notifications.length;
  const readCount = totalCount - unreadCount;

  notificationBadge.textContent = unreadCount;
  notificationBadge.classList.toggle("is-hidden", unreadCount === 0);
  unreadSummary.textContent =
    `${unreadCount === 1 ? "1 unread update" : `${unreadCount} unread updates`} · ${
      totalCount === 1 ? "1 total notification" : `${totalCount} total notifications`
    }`;
  markAllReadButton.disabled = unreadCount === 0;
  markAllUnreadButton.disabled = readCount === 0;
  clearAllButton.disabled = totalCount === 0;
}

function renderNotifications() {
  notificationList.innerHTML = "";
  const searchTerm = notificationSearch.value.trim().toLowerCase();
  const sortedNotifications = notifications
    .map((notification, index) => ({ notification, index }))
    .sort((a, b) => {
      const aPinned = a.notification.pinned ? 1 : 0;
      const bPinned = b.notification.pinned ? 1 : 0;
      return bPinned - aPinned;
    });

  sortedNotifications.forEach(({ notification, index }) => {
    if (currentFilter === "unread" && !notification.unread) {
      return;
    }

    if (currentFilter === "read" && notification.unread) {
      return;
    }

    if (
      currentNotificationCategory !== "all" &&
      notification.category !== currentNotificationCategory
    ) {
      return;
    }

    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm) ||
      notification.message.toLowerCase().includes(searchTerm) ||
      notification.category.toLowerCase().includes(searchTerm);

    if (!matchesSearch) {
      return;
    }

    const item = document.createElement("li");
    item.className = `notification-item${notification.unread ? " unread" : ""}`;

    item.innerHTML = `
      <span class="status-dot" aria-hidden="true"></span>
      <div>
        <p class="notification-title">
          <span class="notification-title-main">
            <span>${notification.title}</span>
            <span class="priority-chip ${notification.priority.toLowerCase()}">${notification.priority}</span>
          </span>
          <span class="notification-time">${notification.time}</span>
        </p>
        <p class="notification-category">${notification.category}</p>
        <p class="notification-message">${notification.message}</p>
        <div class="notification-actions">
          <button class="notification-action-button" data-index="${index}" data-action="toggle-read" type="button">
            ${notification.unread ? "Mark read" : "Mark unread"}
          </button>
          <button class="notification-delete-button" data-index="${index}" data-action="delete" type="button">
            Delete
          </button>
        </div>
      </div>
    `;

    notificationList.appendChild(item);
  });

  if (!notificationList.children.length) {
    notificationList.innerHTML = `
      <li class="notification-empty">
        <p>No matching notifications available.</p>
      </li>
    `;
  }

  updateUnreadState();
}

function closePanel() {
  notificationPanel.hidden = true;
  notificationButton.classList.remove("is-open");
  notificationButton.setAttribute("aria-expanded", "false");
}

function togglePanel() {
  const isOpening = notificationPanel.hidden;

  notificationPanel.hidden = !isOpening;
  notificationButton.classList.toggle("is-open", isOpening);
  notificationButton.setAttribute("aria-expanded", String(isOpening));
}

notificationButton.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel();
});

markAllReadButton.addEventListener("click", () => {
  notifications.forEach((notification) => {
    notification.unread = false;
  });

  renderNotifications();
});

markAllUnreadButton.addEventListener("click", () => {
  notifications.forEach((notification) => {
    notification.unread = true;
  });

  renderNotifications();
});

clearAllButton.addEventListener("click", () => {
  notifications.length = 0;
  renderNotifications();
});

filterAllButton.addEventListener("click", () => {
  currentFilter = "all";
  currentNotificationCategory = "all";
  notificationFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", button === filterAllButton);
  });
  renderNotifications();
});

filterUnreadButton.addEventListener("click", () => {
  currentFilter = "unread";
  currentNotificationCategory = "all";
  notificationFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", button === filterUnreadButton);
  });
  renderNotifications();
});

filterReadButton.addEventListener("click", () => {
  currentFilter = "read";
  currentNotificationCategory = "all";
  notificationFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", button === filterReadButton);
  });
  renderNotifications();
});

notificationFilterButtons.forEach((button) => {
  if (!button.dataset.notificationCategory) {
    return;
  }

  button.addEventListener("click", () => {
    currentFilter = "all";
    currentNotificationCategory = button.dataset.notificationCategory;
    notificationFilterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("is-active", filterButton === button);
    });
    renderNotifications();
  });
});

notificationList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) {
    return;
  }

  const notificationIndex = Number(actionButton.dataset.index);

  if (actionButton.dataset.action === "delete") {
    notifications.splice(notificationIndex, 1);
    renderNotifications();
    return;
  }

  notifications[notificationIndex].unread = !notifications[notificationIndex].unread;
  renderNotifications();
});

notificationSearch.addEventListener("input", renderNotifications);

addDemoAlertButton.addEventListener("click", () => {
  const alertTemplate = demoAlerts[nextDemoAlertIndex % demoAlerts.length];
  notifications.unshift({ ...alertTemplate });
  nextDemoAlertIndex += 1;
  currentFilter = "all";
  currentNotificationCategory = "all";
  notificationSearch.value = "";
  notificationFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", button === filterAllButton);
  });
  renderNotifications();
});

function updateProductResults() {
  const searchTerm = productSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const productName = card.querySelector("strong").textContent.toLowerCase();
    const productDescription = card.querySelector("p").textContent.toLowerCase();
    const matchesSearch =
      productName.includes(searchTerm) || productDescription.includes(searchTerm);
    const matchesCategory =
      currentCategory === "all" || card.dataset.category === currentCategory;
    const isVisible = matchesSearch && matchesCategory;

    card.classList.toggle("is-hidden", !isVisible);

    if (isVisible) {
      visibleCount += 1;
    }
  });

  productCountLabel.textContent =
    visibleCount === 1 ? "Showing 1 product" : `Showing ${visibleCount} products`;
  emptyProducts.hidden = visibleCount > 0;
}

function updateCartSummary() {
  cartSummary.textContent =
    cartItems === 1 ? "1 item in your cart" : `${cartItems} items in your cart`;
}

function closeCartPanel() {
  cartPanel.hidden = true;
  cartButton.classList.remove("is-open");
  cartButton.setAttribute("aria-expanded", "false");
}

function toggleCartPanel() {
  const isOpening = cartPanel.hidden;
  closePanel();
  cartPanel.hidden = !isOpening;
  cartButton.classList.toggle("is-open", isOpening);
  cartButton.setAttribute("aria-expanded", String(isOpening));
}

cartButton.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleCartPanel();
});

function showCartToast(productName) {
  window.clearTimeout(toastTimer);
  cartToastText.textContent = `${productName} added successfully.`;
  cartToast.hidden = false;

  toastTimer = window.setTimeout(() => {
    cartToast.hidden = true;
  }, 2200);
}

productCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.product;

    cartItems += 1;
    cartCount.textContent = cartItems;
    updateCartSummary();
    button.textContent = "Added";
    button.classList.add("is-added");
    button.setAttribute("aria-label", `${productName} added to cart`);
    showCartToast(productName);

    window.setTimeout(() => {
      button.textContent = "Add to cart";
      button.classList.remove("is-added");
      button.setAttribute("aria-label", `Add ${productName} to cart`);
    }, 1200);
  });
});

productSearch.addEventListener("input", updateProductResults);

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;

    categoryButtons.forEach((categoryButton) => {
      categoryButton.classList.toggle("is-active", categoryButton === button);
    });

    updateProductResults();
  });
});

browseOffersButton.addEventListener("click", () => {
  productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("click", (event) => {
  if (!notificationPanel.hidden && !notificationPanel.contains(event.target)) {
    closePanel();
  }

  if (!cartPanel.hidden && !cartPanel.contains(event.target) && !cartButton.contains(event.target)) {
    closeCartPanel();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePanel();
    closeCartPanel();
  }
});

renderNotifications();
updateProductResults();
