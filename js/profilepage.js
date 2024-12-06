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
      headers: {
        Authorization: `Bearer ${token}`, // Legger til token i headeren.
        "X-Noroff-API-Key": "7e68ab4e-0574-4a90-9b16-1b7b1f140b11",
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
        <button class="btn btn-warning btn-sm editPost" data-id="${post.id}">Edit</button>
        <button class="btn btn-sm deletePost" data-id="${post.id}">Delete</button>
        `;

    postList.appendChild(postItem);
  });
}

// Oppretting av nye innlegg.

newPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  debugger;

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
      const response = await fetch(`${API_URL}/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Legg til token
          "X-Noroff-API-Key": "77c72977-e065-42eb-8d8a-793fd55d317f",
        },
      });

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
        <button class="btn btn-secondary btn-sm ccancelEdit">Cancel</button>
        `;
  }

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
