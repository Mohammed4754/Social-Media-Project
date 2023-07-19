//const baseUrl = "https://tarmeezacademy.com/api/v1";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");
console.log(id);

setupUI();

getPost();

//====================================================================================

function getPost() {
  toggleLoader(true);
  axios
    .get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      toggleLoader(false);
      const post = response.data.data;
      //console.log(post);

      let comments = post.comments;
      let author = post.author;
      console.log(author);
      document.getElementById("username-span").innerHTML = author.username;

      let commentsContent = ``;
      for (let comment of comments) {
        commentsContent += `
        <!------- Comment ------->
        <div class="p-3" style="background-color:#f8f8f8">
          <!------- Profile Pic + Username ------->
          <div>
            <img
              src="${comment.author.profile_image}"
              alt=""
              class="rounded-circle"
              style="width: 40px; height: 40px"
            />
            <b>${comment.author.username}</b>
          </div>
          <!-------// Profile Pic + Username //------->

          <!------- COMMENT'S BODY ------->
          <div>
          ${comment.body}
          </div>
          <!-------// COMMENT'S BODY //------->
        </div>
        <!-------// Comment //------->

        
        `;
      }

      const postContent = `
    <div class="card shadow p-3 mb-5">
    <div class="card-header">
      <img
        src="${author.profile_image}"
        alt=""
        class="rounded-circle border border-2"
        style="width: 40px; height: 40px"
      />
      <b>${author.username}</b>
    </div>
    <div class="card-body">
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
        <span> (${post.comments_count}) comments </span>
      </div>
    </div>
    <div id="comments">
    ${commentsContent}
    </div>
    
    <div id="add-comment-div" class="input-group mb-3">
    <input id="comment-input" type="text" placeholder="add your comment here ..." class="form-control"/>
    <button class="btn btn-outline-primary" type="button" onclick="createCommentClicked()">Send</button>
    </div>

  </div>
    `;
      document.getElementById("post").innerHTML = postContent;
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

function createCommentClicked() {
  let commentBody = document.getElementById("comment-input").value;
  let params = {
    body: commentBody,
  };
  let token = localStorage.getItem("token");
  toggleLoader(true);
  axios
    .post(`${baseUrl}/posts/${id}/comments`, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      toggleLoader(false);
      showAlert("The Comment Created successfully");
      getPost();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
