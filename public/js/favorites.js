// Safar Favorites (Izbrannye / Saved Items) Manager
(function() {
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem("safar_favorites")) || [];
    } catch {
      return [];
    }
  }

  function saveFavorites(list) {
    localStorage.setItem("safar_favorites", JSON.stringify(list));
  }

  function isFavorite(type, id) {
    const list = getFavorites();
    return list.some(item => item.type === type && String(item.id) === String(id));
  }

  function toggleFavorite(item) {
    const token = localStorage.getItem("safar_token");
    if (!token) {
      alert("Sevimlilarga saqlash uchun avval tizimga kiring.");
      location.href = "login.html?redirect=saved";
      return false;
    }
    let list = getFavorites();
    const index = list.findIndex(x => x.type === item.type && String(x.id) === String(item.id));
    let added = false;
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(item);
      added = true;
    }
    saveFavorites(list);
    return added;
  }

  window.SafarFav = { getFavorites, isFavorite, toggleFavorite };
})();
