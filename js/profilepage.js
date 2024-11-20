const postList = document.getElementById("postList");
const newPostForm = document.getElementById("newPostForm");
const token = localStorage.getItem("jwtToken"); // Token fra innloggingen

// Funksjon for å hente brukerens innlegg:

async function fetchPost() {
  try {
    const response = await fetch("https://api.noroff.no/social/posts", {
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

// Oppretting av nye innlegg:
