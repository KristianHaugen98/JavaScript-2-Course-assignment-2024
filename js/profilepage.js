const postList = document.getElementById("postList");
const newPostForm = document.getElementById("newPostForm");
const postTitle = document.getElementById("postTitle");
const postBody = document.getElementById("postBody");
const token = localStorage.getItem("jwtToken"); // Token fra innloggingen
const API_URL = "https://v2.api.noroff.dev/social/posts";

// Funksjon for å hente brukerens innlegg:

async function fetchPost() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Legger til token i headeren.
        "X-Noroff-API-Key": "7e68ab4e-0574-4a90-9b16-1b7b1f140b11",
      },
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      displayPost(jsonResponse.posts || jsonResponse.data || jsonResponse); // Viser innlegg i UI.
    } else {
      console.error("Failed to fetch posts");
    }
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
}

fetchPost();
// Funksjonen for å vise innlegg:

function displayPost(posts) {
  postList.innerHTML = ""; // Tømmer listen før ny rendering.
  posts.forEach((post) => {
    const postItem = document.createElement("li");
    postItem.className = "list-group-item";

    postItem.innerHTML = `
        <h5 class="post-title" data-id="${post.id}">${post.title}</h5>
        <p>${post.body}</p>
        <button class="btn btn-warning btn-sm editPost" data-id="${post.id}">Edit</button>
        <button class="btn btn-sm deletePost" data-id="${post.id}">Delete</button>
        `;

    postList.appendChild(postItem);
  });
}

// Oppretting av nye innlegg.

newPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const content = postBody.value.trim();
  const title = postTitle.value.trim();

  if (!content || !title) return;

  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS3Jpc3RpYW4iLCJlbWFpbCI6ImtyaWhhdTUwODcxQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzMzNDExNDYzfQ.9WIiTZRcF5UMBTsNg1LFJQq4FbV-8M-SBcaX1V6uC3I`,
        "X-Noroff-API-Key": "c18cc228-141a-4c70-bc09-cedf28ae6384",
      },
      body: JSON.stringify({
        body: content,
        title: title,
      }),
    });

    if (response.ok) {
      postBody.value = "";
      postTitle.value = "";
      fetchPost();
    } else {
      console.log("Failed to create post");
    }
  } catch (err) {
    console.log("Error creating post:", err);
  }
});

// Sletting av innlegg

postList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("deletePost")) {
    const postId = e.target.getAttribute("data-id");

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/social/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Legg til token
            "X-Noroff-API-Key": "77c72977-e065-42eb-8d8a-793fd55d317f",
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

postList.addEventListener("click", (e) => {
  if (e.target.classList.contains("editPost")) {
    const postItem = e.target.closest("li");
    const currentTitle = postItem.querySelector("h5").textContent;
    const currentBody = postItem.querySelector("p").textContent;

    postItem.innerHTML = `
        <input type="text" class="form-control mb-2 editTitle" value="${currentTitle}">
        <textarea class="form-control mb-2 editBody">${currentBody}</textarea>
        <button class="btn btn-primary btn-sm saveEdit" data-id="${e.target.getAttribute(
          "data-id"
        )}">Save</button>
        <button class="btn btn-secondary btn-sm ccancelEdit">Cancel</button>
        `;
  }
  // Abryt redigeringen
  if (e.target.classList.contains("cancelEdit")) {
    fetchPost(); // Tilbakestiller listen.
  }
});

// Lagre redigerte innlegg
postList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("saveEdit")) {
    const postId = e.target.getAttribute("data-id");
    const postItem = e.target.closest("li");

    const updateTitle = postItem.querySelector(".editTitle").value.trim();
    const updateBody = postItem.querySelector(".editBody").value.trim();

    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "77c72977-e065-42eb-8d8a-793fd55d317f",
        },
        body: JSON.stringify({ title: updateTitle, body: updateBody }),
      });

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

// Gjør det mulig å søker i søkefeltet i navigasjonsmenyen

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase(); // Dette gjør søket case-insensitivt
  const postItems = document.querySelectorAll("#postList .list-group-item");

  postItems.forEach((postItem) => {
    const title = postItem.querySelector("h5").textContent.toLowerCase();
    const body = postItem.querySelector("p").textContent.toLowerCase();

    // Vis eller sjul innlegg basert på søketerm
    if (title.includes(searchTerm) || body.includes(searchTerm)) {
      postItem.style.display = ""; // Viser innlegget
    } else {
      postItem.style.display = "none"; // Sjuler innlegget
    }
  });
});

// Funksjoner for å hente og viser innlegget man velger.

async function viewPostById(postId) {
  try {
    const response = await fetch(`${API_URL}/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": "77c72977-e065-42eb-8d8a-793fd55d317f",
      },
    });

    if (response.ok) {
      const post = await response.json();
      displaySinglePost(post); // Sender data til en visningsfunksjon
    } else {
      console.error("Failed to fetch the post by ID");
    }
  } catch (err) {
    console.error("Error fetching the post by ID:", err);
  }
}

// Funksjonen for å vise innholdet i et enkelt innlegg.

function displaySinglePost(post) {
  const postDetailContainer = document.getElementById("postDetail");
  const postListContainer = document.getElementById("postList");

  // Her fyller eg inn innleggsdetaljer

  postDetailContainer.innerHTML = `
    <h2 style="text-align: center; margin-top: 20px;">${post.data.title}</h2>
    <p style="text-align: center; margin: 20px;">${post.data.body}</p>
    <button class="btn d-grid col-6 mx-auto btn-primary" id="backToPosts">Back to all posts</button>
  `;

  // Viser til detaljedelen,  og sjuler listen

  postDetailContainer.style.display = "block";
  postListContainer.style.display = "none";

  // Legger til event listener på tilbake knappen

  document.getElementById("backToPosts").addEventListener("click", () => {
    postDetailContainer.style.display = "none"; // Dette sjuler detaljene
    postListContainer.style.display = "block"; // Dette viser innleggsliste
  });
}

postList.addEventListener("click", (e) => {
  if (e.target.classList.contains("post-title")) {
    const postId = e.target.getAttribute("data-id");
    viewPostById(postId); // Hent innlegget basert på ID
  }
});
