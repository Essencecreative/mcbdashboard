// src/api.js
const API_BASE = process.env.REACT_APP_API_URL || "http://66.29.133.39:5000";

export const createProduct = async (formData) => {
  const token = localStorage.getItem("token"); // if you use JWT

  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create product");
  }

  const data = await res.json();
  return data.product;
};

export const getProducts = async (page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE}/products?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const getProduct = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
};

export const updateProduct = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update product");
  }

  const data = await res.json();
  return data.product;
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to delete product");
};

// News and Updates API
export const createNewsAndUpdate = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/news-and-updates`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create news & update");
  }

  const data = await res.json();
  return data.newsAndUpdate;
};

export const getNewsAndUpdates = async (page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE}/news-and-updates?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch news & updates");
  return res.json();
};

export const getNewsAndUpdate = async (id) => {
  const res = await fetch(`${API_BASE}/news-and-updates/${id}`);
  if (!res.ok) throw new Error("News & update not found");
  return res.json();
};

export const updateNewsAndUpdate = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/news-and-updates/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update news & update");
  }

  const data = await res.json();
  return data.newsAndUpdate;
};

export const deleteNewsAndUpdate = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/news-and-updates/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to delete news & update");
};

// Investor News API
export const createInvestorNews = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/investor-news`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create investor news");
  }

  const data = await res.json();
  return data.investorNews;
};

export const getInvestorNews = async (page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE}/investor-news?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch investor news");
  return res.json();
};

export const getInvestorNewsItem = async (id) => {
  const res = await fetch(`${API_BASE}/investor-news/${id}`);
  if (!res.ok) throw new Error("Investor news not found");
  return res.json();
};

export const updateInvestorNews = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/investor-news/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update investor news");
  }

  const data = await res.json();
  return data.investorNews;
};

export const deleteInvestorNews = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/investor-news/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to delete investor news");
};

// Investor Categories API
export const createInvestorCategory = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/investor-categories`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create investor category item");
  }

  const data = await res.json();
  return data.item;
};

export const getInvestorCategories = async (category, page = 1, limit = 10) => {
  const url = category 
    ? `${API_BASE}/investor-categories?category=${category}&page=${page}&limit=${limit}`
    : `${API_BASE}/investor-categories?page=${page}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch investor category items");
  return res.json();
};

export const getInvestorCategory = async (id) => {
  const res = await fetch(`${API_BASE}/investor-categories/${id}`);
  if (!res.ok) throw new Error("Investor category item not found");
  return res.json();
};

export const updateInvestorCategory = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/investor-categories/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update investor category item");
  }

  const data = await res.json();
  return data.item;
};

export const deleteInvestorCategory = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/investor-categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to delete investor category item");
};

// Carousel API
export const createCarousel = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/carousel`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create carousel item");
  }

  const data = await res.json();
  return data.carousel;
};

export const getCarousels = async (page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE}/carousel?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch carousel items");
  return res.json();
};

export const getCarousel = async (id) => {
  const res = await fetch(`${API_BASE}/carousel/${id}`);
  if (!res.ok) throw new Error("Carousel item not found");
  return res.json();
};

export const updateCarousel = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/carousel/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update carousel item");
  }

  const data = await res.json();
  return data.carousel;
};

export const deleteCarousel = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/carousel/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to delete carousel item");
};

// Board of Directors API
export const createBoardMember = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/board-of-directors`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create board member");
  }

  const data = await res.json();
  return data.member;
};

export const getBoardMembers = async () => {
  const res = await fetch(`${API_BASE}/board-of-directors`);
  if (!res.ok) throw new Error("Failed to fetch board members");
  return res.json();
};

export const getBoardMember = async (id) => {
  const res = await fetch(`${API_BASE}/board-of-directors/${id}`);
  if (!res.ok) throw new Error("Board member not found");
  return res.json();
};

export const updateBoardMember = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/board-of-directors/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update board member");
  }

  const data = await res.json();
  return data.member;
};

export const deleteBoardMember = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/board-of-directors/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to delete board member");
};

// Management API
export const createManagementMember = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/management`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create management member");
  }

  const data = await res.json();
  return data.member;
};

export const getManagementMembers = async () => {
  const res = await fetch(`${API_BASE}/management`);
  if (!res.ok) throw new Error("Failed to fetch management members");
  return res.json();
};

export const getManagementMember = async (id) => {
  const res = await fetch(`${API_BASE}/management/${id}`);
  if (!res.ok) throw new Error("Management member not found");
  return res.json();
};

export const updateManagementMember = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/management/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update management member");
  }

  const data = await res.json();
  return data.member;
};

export const deleteManagementMember = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/management/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to delete management member");
};

// Header Update API
export const createHeaderUpdate = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/header-update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create header update");
  }

  const data = await res.json();
  return data.update;
};

export const getHeaderUpdates = async () => {
  const res = await fetch(`${API_BASE}/header-update`);
  if (!res.ok) throw new Error("Failed to fetch header updates");
  return res.json();
};

export const getHeaderUpdate = async (id) => {
  const res = await fetch(`${API_BASE}/header-update/${id}`);
  if (!res.ok) throw new Error("Header update not found");
  return res.json();
};

export const updateHeaderUpdate = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/header-update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update header update");
  }

  const data = await res.json();
  return data.update;
};

export const deleteHeaderUpdate = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/header-update/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to delete header update");
};

// Menu Categories API
export const createMenuCategory = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/menu-categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create menu category");
  }

  const data = await res.json();
  return data.category;
};

export const getMenuCategories = async () => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_BASE}/menu-categories/all`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch menu categories");
  const data = await res.json();
  return data.categories || [];
};

export const getMenuCategory = async (id) => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_BASE}/menu-categories/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("Menu category not found");
  const data = await res.json();
  return data.category;
};

export const updateMenuCategory = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/menu-categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update menu category");
  }

  const data = await res.json();
  return data.category;
};

export const deleteMenuCategory = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/menu-categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to delete menu category");
};

// Menu Items API
export const createMenuItem = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/menu-items`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create menu item");
  }

  const data = await res.json();
  return data.item;
};

export const getMenuItems = async (menuCategory, subcategory, route) => {
  const token = localStorage.getItem("token");
  
  let url = `${API_BASE}/menu-items/all`;
  if (menuCategory) url += `?menuCategory=${menuCategory}`;
  if (subcategory) url += `&subcategory=${encodeURIComponent(subcategory)}`;
  if (route) url += `&route=${encodeURIComponent(route)}`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch menu items");
  const data = await res.json();
  return data.items || [];
};

export const getMenuItem = async (id) => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_BASE}/menu-items/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("Menu item not found");
  const data = await res.json();
  return data.item;
};

export const updateMenuItem = async (id, formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/menu-items/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update menu item");
  }

  const data = await res.json();
  return data.item;
};

export const deleteMenuItem = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/menu-items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw new Error("Failed to delete menu item");
};

// Wakala API functions
export const createWakala = async (wakalaData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/wakala`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(wakalaData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create wakala location");
  }

  const data = await res.json();
  return data.wakala;
};

export const getWakalas = async () => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_BASE}/wakala/all`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch wakala locations");
  const data = await res.json();
  return data.wakalas || [];
};

export const getWakala = async (id) => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_BASE}/wakala/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("Wakala location not found");
  const data = await res.json();
  return data.wakala;
};

export const updateWakala = async (id, wakalaData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/wakala/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(wakalaData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update wakala location");
  }

  const data = await res.json();
  return data.wakala;
};

export const deleteWakala = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/wakala/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete wakala location");
  }
};

// FAQ API functions
export const createFAQ = async (faqData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/faqs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(faqData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create FAQ");
  }

  const data = await res.json();
  return data.faq;
};

export const getFAQs = async () => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_BASE}/faqs/all`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch FAQs");
  const data = await res.json();
  return data.faqs || [];
};

export const getFAQ = async (id) => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("FAQ not found");
  const data = await res.json();
  return data.faq;
};

export const updateFAQ = async (id, faqData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(faqData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update FAQ");
  }

  const data = await res.json();
  return data.faq;
};

export const deleteFAQ = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete FAQ");
  }
};