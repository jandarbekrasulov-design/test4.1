const url = "https://dummyjson.com/products";
const list = document.querySelector("#list");
const form = document.querySelector("#form");
const input = document.querySelector("#name");
const message = document.querySelector("#message");

function render(product) {
  const card = document.createElement("article");
  const image = document.createElement("img");
  if (product.thumbnail) image.src = product.thumbnail;
  image.alt = product.title || "Изображение товара";

  const title = document.createElement("h2");
  title.textContent = product.title;
  const price = document.createElement("p");
  price.textContent = product.price == null ? "Цена не указана" : `$${product.price}`;
  const button = document.createElement("button");
  button.textContent = "Удалить";
  button.onclick = async () => {
    try {
      const response = await fetch(`${url}/${product.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      card.remove();
    } catch {
      message.textContent = "Не удалось удалить товар.";
    }
  };

  card.append(image, title, price, button);
  list.append(card);
}

fetch(url)
  .then(response => {
    if (!response.ok) throw new Error();
    return response.json();
  })
  .then(data => data.products.forEach(render))
  .catch(() => { message.textContent = "Не удалось загрузить товары."; });

form.onsubmit = async event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) {
    message.textContent = "Введите название товара.";
    return;
  }

  try {
    const response = await fetch(`${url}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price: 0 }),
    });
    if (!response.ok) throw new Error();
    const product = await response.json();
    render({ ...product, title: product.title || title });
    input.value = "";
    message.textContent = "";
  } catch {
    message.textContent = "Не удалось добавить товар.";
  }
};
