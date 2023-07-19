//const baseUrl = "https://tarmeezacademy.com/api/v1";

//=========================== INFINITE SCROLL ===========================

let currentPage = 1;
let lastPage = 1;

window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 100;

  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});

//===========================// INFINITE SCROLL //===========================

setupUI();

getPosts();

//====================================================================================

function getPosts(reload = true, page = 1) {
  toggleLoader(true);
  axios.get(`${baseUrl}/posts?limit=5&page=${page}`).then((response) => {
    toggleLoader(false);
    const posts = response.data.data;
    lastPage = response.data.meta.last_page;

    if (reload) {
      document.getElementById("posts").innerHTML = "";
    }

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
    <span onclick="userClicked(${post.author.id})" style="cursor:pointer">
      <img
        src="${post.author.profile_image}"
        alt=""
        class="rounded-circle border border-2"
        style="width: 40px; height: 40px"
      />
      <b>${post.author.username}</b>
    </span>

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
      document.getElementById("posts").innerHTML += content;

      document.getElementById(`post-tags-${post.id}`).innerHTML = "";
      for (let tag of post.tags) {
        let tagsContent = `
        <button class="btn btn-sm rounded-5" style="background-color:gray;color:white">${tag.name}</button>
        `;
        document.getElementById(`post-tags-${post.id}`).innerHTML +=
          tagsContent;
      }
    }
  });
}

//====================================================================================

function postClicked(postId) {
  window.location = `./post_details.html?postId=${postId}`;
}

//====================================================================================
/*
function addBtnClicked() {
  document.getElementById("post-modal-title").innerHTML = "Create New Post";
  document.getElementById("post-modal-submit-btn").innerHTML = "Create";
  document.getElementById("post-id-input").value = "";

  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";

  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}
*/
//====================================================================================

function userClicked(userId) {
  window.location = `./profile.html?userid=${userId}`;
}

//====================================================================================
