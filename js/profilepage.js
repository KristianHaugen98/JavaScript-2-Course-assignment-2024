const postList = document.getElementById("postList");
const newPostForm = document.getElementById("newPostForm");
const token = localStorage.getItem("jwtToken"); // Token fra innloggingen

// Funksjon for å hente brukerens innlegg:

async function fetchPost() {
  try {
    const response = await fetch("80826ae6-e374-4cd5-ae00-0b6aeadd83de", {
      headers: {
        Authorization: `Bearer ${token}`, // Legger til token i headeren.
      },
    });

    if (response.ok) {
      const posts = await response.json();
      displayPost(posts); // Viser innlegg i UI.
    } else {
      console.error("Failed to fetch posts");
    }
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
}

// Funksjonen for å vise innlegg:

function displayPost(posts) {
  postList.innerHTML = ""; // Tømmer listen før ny rendering.
  posts.forEach((post) => {
    const postItem = document.createElement("li");
    postItem.className = "list-group-item";

    postItem.innerHTML = `
        <h5>${post.title}</h5>
        <p>${post.body}</p>
        <button class="btn btn-warning btn-sm editPost" data-id="${
          post.id
        }">Edit</button>
        <button class="btn btn-sm deletePost" data-id="${
          post - id
        }">Delete</button>
        `;

    postList.appendChild(postItem);
  });
}

// Oppretting av nye innlegg.

function post(path, params, method = "post") {
  const form = document.createElement("form");
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = docmunet.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  docmunet.body.appendChild(form);
  form.submit();
}

// Sletting av innlegg

postList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("deletePost")) {
    const postId = e.target.getAttribute("data-id");

    try {
      const response = await fetch(
        `80826ae6-e374-4cd5-ae00-0b6aeadd83de${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Legg til token
          },
        }
      );

      if (response.ok) {
        fetchPost(); // Oppdater innleggene
      } else {
        console.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  }
});

// Denne koden gjør det mulig å redigere innleggene:

postList.addEventListener("Click", (e) => {
  if (e.target.classList.contains("editPost")) {
    const postID = e.target.getAttribute("data-id");
    const postItem = e.target.getAttribute("data-id");

    const currentTitle = postItem.querySelector("h5").textContent;
    const currentBody = postItem.querySelector("p").textContent;

    postItem.innerHTML = `
        <input type="text" class="form-control mb-2 editTitle" value="${currentTitle}">
        <textarea class="form-control mb-2 editBody">${currentBody}</textarea>
        <button class="btn btn-secondary btn-sm ccancelEdit">Cancel</button>
        `;
  }

  if (e.target.classList.contains("cancelEdit")) {
    fetchPost(); // Tilbakestiller listen.
  }
});

postList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("saveEdit")) {
    const postId = e.target.getAttribute("data-id");
    const postItem = e.target.closest("li");

    const updateTitle = postItem.querySelector(".editTitle").value.trim();
    const updateBody = postItem.querySelector("editBody").value.trim();

    try {
      const response = await fetch(
        `80826ae6-e374-4cd5-ae00-0b6aeadd83de${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: updateTitle, body: updateBody }),
        }
      );

      if (response.ok) {
        fetchPost(); // Oppdater innleggene
      } else {
        console.error("Failed to update post");
      }
    } catch (err) {
      console.error("Error updating post:", err);
    }
  }
});
