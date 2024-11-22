document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://fakestoreapi.com/products';
  const productList = document.getElementById('product-list');
  const loadMoreButton = document.getElementById('load-more');
  const errorMessage = document.getElementById('error-message');
  const searchBar = document.getElementById('search-bar');
  const sortOptions = document.getElementById('sort-options');  
  const categoryFilter = document.getElementById('category-filter');
  const mobileMenu = document.getElementById('mobile-menu');
  const navbar = document.querySelector('.navbar');
  const loader = document.querySelector('.loader');
  const product = document.querySelector('.products');


  mobileMenu.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });

  let allProducts = [];
  let displayedProducts = [];
  let start = 0;
  const limit = 10;

  function createData(products) {
    products.forEach((product) => {
      const productCard = document.createElement('div');
      productCard.classList.add('product');
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>${product.description.substring(0, 100)}...</p>
        <p class="price">$${product.price}</p>
      `;
      productList.appendChild(productCard);
    });
  }

  function fetchData() {
    productList.innerHTML = `<div class="shimmer"></div>`;
    loader.style.display = 'block';
    product.style.display = 'none';
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        allProducts = data;
        displayedProducts = allProducts.slice(0, limit);
        createData(displayedProducts);
        populateFilter(data);
        loader.style.display = 'none';
        product.style.display = 'block';

      })
      .catch(() => {
        loader.style.display = 'none';
        product.style.display = 'block';
        errorMessage.classList.remove('hidden');
      });
  }



  function populateFilter(products) {
    const categories = Array.from(new Set(products.map((product) => product.category)));
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function applyFilters() {
    const category = categoryFilter.value;

    displayedProducts = allProducts.filter((product) => {
      return (
        (category === 'all' || product.category === category)
      );
    });
    productList.innerHTML = '';
    createData(displayedProducts.slice(0, limit));
  }

  categoryFilter.addEventListener('change', applyFilters);

  loadMoreButton.addEventListener('click', () => {
    start += limit;
    const moreProducts = allProducts.slice(start, start + limit);
    createData(moreProducts);
    if (start + limit >= allProducts.length) {
      loadMoreButton.style.display = 'none';
    }
  });

  sortOptions.addEventListener('change', () => {
    const sortBy = sortOptions.value;
    if (sortBy === 'price-asc') {
      displayedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      displayedProducts.sort((a, b) => b.price - a.price);
    }
    productList.innerHTML = '';
    createData(displayedProducts.slice(0, limit));
  });

  searchBar.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = allProducts.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    productList.innerHTML = '';
    createData(filtered.slice(0, limit));
  });

  fetchData();
  
});
