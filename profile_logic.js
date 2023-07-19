function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
}

//====================================================================================

function getCurrentUser() {
  let user = null;
  storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

//====================================================================================

setupUI();

getUser();

function getUser() {
  const id = getCurrentUserId();
  toggleLoader(true);
  axios
    .get(`${baseUrl}/users/${id}`)
    .then((response) => {
      toggleLoader(false);
      const user = response.data.data;

      document.getElementById("main-info-email").innerHTML = user.email;
      document.getElementById("main-info-name").innerHTML = user.name;
      document.getElementById("main-info-username").innerHTML = user.username;
      document.getElementById("posts-count").innerHTML = user.posts_count;
      document.getElementById("comments-count").innerHTML = user.comments_count;
      document.getElementById("main-info-image").src = user.profile_image;
      document.getElementById("name-posts").innerHTML = `${user.username}'s`;
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

//====================================================================================

getPosts();

function getPosts() {
  const id = getCurrentUserId();
  toggleLoader(true);
  axios
    .get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
      toggleLoader(false);
      const posts = response.data.data;

      document.getElementById("user-posts").innerHTML = "";

      for (let post of posts) {
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;

        let editButtonContent = ``;
        if (isMyPost) {
          editButtonContent = `
          <button class="btn btn-danger" style="float:right" onclick="deletePostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Delete</button>
  
          <button class="btn btn-secondary mx-2" style="float:right" onclick="editPostBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Edit</button>`;
        }

        let content = `
      <div class="card shadow p-3 mb-5">
      <div class="card-header">
        <img
          src="${post.author.profile_image}"
          alt=""
          class="rounded-circle border border-2"
          style="width: 40px; height: 40px"
        />
        <b>${post.author.username}</b>
        ${editButtonContent}
  
      </div>
      <div class="card-body" onclick="postClicked(${
        post.id
      })" style="cursor:pointer">
        <img src="${post.image}" alt="" class="w-100" />
        <h6 class="mt-1" style="color: rgb(193, 193, 193)">
        ${post.created_at}
        </h6>
        <h5>${post.title ?? `----`}</h5>
        <p>${post.body}</p>
        <hr />
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-pen"
            viewBox="0 0 16 16"
          >
            <path
              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
            />
          </svg>
          <span> (${post.comments_count}) comments
          <span id="post-tags-${
            post.id
          }"><button class="btn btn-sm rounded-5" style="background-color:gray;color:white"></button></span>
        </div>
      </div>
    </div>
      `;
        document.getElementById("user-posts").innerHTML += content;

        document.getElementById(`post-tags-${post.id}`).innerHTML = "";
        for (let tag of post.tags) {
          let tagsContent = `
          <button class="btn btn-sm rounded-5" style="background-color:gray;color:white">${tag.name}</button>
          `;
          document.getElementById(`post-tags-${post.id}`).innerHTML +=
            tagsContent;
        }
      }
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
