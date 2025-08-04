let itemList = [
  { name: 'Oppressor Mk2', categories: ['Car', 'Motorcycle'], price: 8000000 },
  { name: 'Oppressor Mk1', categories: ['Car', 'Motorcycle'], price: 2750000 },

  { name: 'Blazer Aqua', categories: ['Car', 'Quad'], price: 1755600 },
  { name: 'Street Blazer', categories: ['Car', 'Quad'], price: 81000 },
    
  { name: 'Terrorbyte', categories: ['Car', 'Truck'], price: 3459500 },
  
  { name: 'Granger 3600LX', categories: ['Car'], price: 2000000 },
  { name: 'Zentorno', categories: ['Car'], price: 725000 },
  { name: 'Tempesta', categories: ['Car'], price: 1329000 },
  { name: 'Weaponized Ignus', categories: ['Car'], price: 4500000 },
  { name: 'Vigilante', categories: ['Car'], price: 3750000 },
  { name: 'Rocket Voltic', categories: ['Car'], price: 3830400 },
  { name: 'Stromberg', categories: ['Car'], price: 2500000 },
  { name: 'Deluxo', categories: ['Car'], price: 5750000 },
  { name: 'Sentinel GTS', categories: ['Car'], price: 2172000 },
  { name: 'Toros', categories: ['Car'], price: 498000 },
  { name: 'T20', categories: ['Car'], price: 2200000 },
  { name: 'Tyrus', categories: ['Car'], price: 2550000 },
  { name: 'Emerus', categories: ['Car'], price: 2750000 },

  { name: 'Rhino Tank', categories: ['Car', 'Tank'], price: 3000000 },
  { name: 'TM-02 Khanjali', categories: ['Car', 'Tank'], price: 3850350 },

  { name: 'P-996 LAZER', categories: ['Plane'], price: 6500000 },
  { name: 'F-160 Raiju', categories: ['Plane'], price: 6855000 },
  { name: 'Hydra', categories: ['Plane'], price: 3990000 },
  { name: 'Luxor', categories: ['Plane'], price: 1625000 },
  { name: 'Luxor Deluxe', categories: ['Plane'], price: 10000000 },

  { name: 'Sparrow', categories: ['Helicopter'], price: 1815000 },
  { name: 'Buzzard Attack Chopper', categories: ['Helicopter'], price: 2000000 },

  { name: 'Service Carbine', categories: ['Weapon'], price: 370000 },
  { name: 'Minigun', categories: ['Weapon'], price: 50000 },
  { name: 'Assault Shotgun', categories: ['Weapon'], price: 10000 },
  { name: 'Up-N-Atomizer', categories: ['Weapon'], price: 399000 },
  
  { name: 'West Vinewood Nightclub', categories: ['Property'], price: 1700000 },
  { name: 'Eclipse Towers Penthouse Suite 3', categories: ['Property'], price: 1100000 },
  { name: 'Eclipse Towers Penthouse Suite 2', categories: ['Property'], price: 905000 },
  { name: 'Eclipse Towers Penthouse Suite 1', categories: ['Property'], price: 985000 },
];

let currentItemPage = 0;
let currentWishlistPage = 0;
const itemsPerPage = 12;
let wishlistItems = [];
let total = 0;
let filteredList = [...itemList];

const itemsDiv = document.getElementById('items');
const wishlist = document.getElementById('wishlist');
const totalDiv = document.getElementById('total');
const prevItemsBtn = document.getElementById('prevItems');
const nextItemsBtn = document.getElementById('nextItems');
const prevWishlistBtn = document.getElementById('prevWishlist');
const nextWishlistBtn = document.getElementById('nextWishlist');
const categoryFilter = document.getElementById('categoryFilter');
const sortOrder = document.getElementById('sortOrder');
const searchBox = document.getElementById('searchBox');

categoryFilter.onchange = applyFilters;
sortOrder.onchange = applyFilters;
searchBox.oninput = applyFilters;

function updateURLWishlist() {
  const names = wishlistItems.map(item => encodeURIComponent(item.name));
  const params = new URLSearchParams(window.location.search);
  params.set('wishlist', names.join(','));
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  history.replaceState(null, '', newUrl);
}

function loadWishlistFromURL() {
  const params = new URLSearchParams(window.location.search);
  const wishlistParam = params.get('wishlist');
  if (!wishlistParam) return;

  const names = wishlistParam.split(',').map(decodeURIComponent);
  wishlistItems = names
    .map(name => itemList.find(item => item.name === name))
    .filter(Boolean);
  total = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  updateTotal();
}



function updateTotal() {
  totalDiv.textContent = `Total: $${total.toLocaleString()}`;
}

function applyFilters() {
  const type = categoryFilter.value;
  const sort = sortOrder.value;
  const search = searchBox.value.trim().toLowerCase();

    filteredList = itemList.filter(item =>
        (type === 'All' || item.categories.includes(type)) &&
        item.name.toLowerCase().includes(search)
    );


  if (sort === 'name') {
    filteredList.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'random') {
    filteredList.sort(() => Math.random() - 0.5);
  }

  currentItemPage = 0;
  renderItems();
}

function renderItems() {
  itemsDiv.innerHTML = '';
  const start = currentItemPage * itemsPerPage;
  const pageItems = filteredList.slice(start, start + itemsPerPage);
  pageItems.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'image-button';
    btn.onclick = () => addItemToWishlist(item);

    const img = document.createElement('img');
    img.src = `images/${item.name.replace(/ /g, '_').replace(/\./g, '')}.jpg`;
    img.alt = item.name;

    const label = document.createElement('span');
    label.textContent = `${item.name} - $${item.price.toLocaleString()}`;

    btn.appendChild(img);
    btn.appendChild(label);
    itemsDiv.appendChild(btn);
  });
}

function addItemToWishlist(item) {
  wishlistItems.push(item);
  total += item.price;
  updateTotal();
  renderWishlist();
  updateURLWishlist();
}

function removeItemFromWishlist(index) {
  const li = wishlist.children[index % itemsPerPage];
  li.classList.add('fade-out');
  setTimeout(() => {
    total -= wishlistItems[index].price;
    wishlistItems.splice(index, 1);
    updateTotal();
    renderWishlist();
    updateURLWishlist();
  }, 300);
}

function renderWishlist() {
  wishlist.innerHTML = '';
  const start = currentWishlistPage * itemsPerPage;
  const pageItems = wishlistItems.slice(start, start + itemsPerPage);
  pageItems.forEach((item, i) => {
    const li = document.createElement('li');
    li.classList.add('fade-in');
    li.draggable = true;
    li.dataset.index = start + i;

    const text = document.createElement('span');
    text.textContent = `${start + i + 1}. ${item.name} (${item.categories.join(', ')}) - $${item.price.toLocaleString()}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeItemFromWishlist(start + i);
    removeBtn.className = 'remove-button';

    li.appendChild(text);
    li.appendChild(removeBtn);
    wishlist.appendChild(li);
  });
}

const copyLinkBtn = document.getElementById('copyLinkBtn');
const copyStatus = document.getElementById('copyStatus');

copyLinkBtn.onclick = () => {
  updateURLWishlist(); // Ensure URL is fresh
  navigator.clipboard.writeText(window.location.href).then(() => {
    copyStatus.textContent = "Link copied!";
    setTimeout(() => copyStatus.textContent = '', 2000);
  }).catch(err => {
    copyStatus.textContent = "Failed to copy.";
  });
};

wishlist.addEventListener('dragstart', e => {
  e.dataTransfer.setData('text/plain', e.target.dataset.index);
});

wishlist.addEventListener('dragover', e => {
  e.preventDefault();
  const target = e.target.closest('li');
  if (target) target.style.borderTop = '2px solid #fff';
});

wishlist.addEventListener('dragleave', e => {
  const target = e.target.closest('li');
  if (target) target.style.borderTop = '';
});

wishlist.addEventListener('drop', e => {
  e.preventDefault();
  const fromIndex = +e.dataTransfer.getData('text/plain');
  const toIndex = +e.target.closest('li').dataset.index;
  const item = wishlistItems.splice(fromIndex, 1)[0];
  wishlistItems.splice(toIndex, 0, item);
  renderWishlist();
  updateURLWishlist(); // <-- ADD THIS LINE
});

prevItemsBtn.onclick = () => {
  if (currentItemPage > 0) currentItemPage--;
  renderItems();
};

nextItemsBtn.onclick = () => {
  if ((currentItemPage + 1) * itemsPerPage < filteredList.length) currentItemPage++;
  renderItems();
};

prevWishlistBtn.onclick = () => {
  if (currentWishlistPage > 0) currentWishlistPage--;
  renderWishlist();
};

nextWishlistBtn.onclick = () => {
  if ((currentWishlistPage + 1) * itemsPerPage < wishlistItems.length) currentWishlistPage++;
  renderWishlist();
};

applyFilters();
loadWishlistFromURL();
renderWishlist();