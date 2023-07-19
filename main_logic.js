const baseUrl = "https://tarmeezacademy.com/api/v1";

function setupUI() {
  const token = localStorage.getItem("token");

  const loggedInDiv = document.getElementById("logged-in-div");
  const logoutDiv = document.getElementById("logout-div");

  const addBtn = document.getElementById("add-btn");

  if (token === null) {
    loggedInDiv.style.setProperty("display", "flex", "important");

    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }

    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    loggedInDiv.style.setProperty("display", "none", "important");

    if (addBtn != null) {
      addBtn.style.setProperty("display", "block", "important");
    }

    logoutDiv.style.setProperty("display", "flex", "important");

    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
  }
}

//=================================================================================

function loginBtnClicked() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  const params = {
    username: username,
    password: password,
  };
  toggleLoader(true);
  axios
    .post(`${baseUrl}/login`, params)
    .then((response) => {
      toggleLoader(false);
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("logged in successfully");

      setupUI();
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

function registerBtnClicked() {
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;
  const image = document.getElementById("register-image-input").files[0];

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  toggleLoader(true);

  axios
    .post(`${baseUrl}/register`, formData, { headers: headers })
    .then((response) => {
      toggleLoader(false);
      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("New User Registered successfully");

      setupUI();
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

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("logged out successfully");
  setupUI();
}

//====================================================================================

function showAlert(customMessage, type = "success") {
  const alertPlaceholder = document.getElementById("success-alert");
  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  alert(customMessage, type);

  setTimeout(() => {
    alertToHide = bootstrap.Alert.getOrCreateInstance("#success-alert");
  }, 3000);
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

function createNewPostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  let url = ``;

  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }

  toggleLoader(true);

  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      toggleLoader(false);
      console.log(response.data);
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("New Post Has Been Created");

      getPosts();
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

function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));

  document.getElementById("post-id-input").value = post.id;

  document.getElementById("post-modal-title").innerHTML = "Edit post";

  document.getElementById("post-modal-submit-btn").innerHTML = "Update";

  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

//====================================================================================

function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));

  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
}

//====================================================================================

function confirmPostDelete() {
  const postId = document.getElementById("delete-post-id-input").value;

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  axios
    .delete(`${baseUrl}/posts/${postId}`, { headers: headers })
    .then((response) => {
      // console.log(response.data);

      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("The post has been deleted successfully");

      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}

//====================================================================================

function profileClicked() {
  const user = getCurrentUser();
  window.location = `./profile.html?userid=${user.id}`;
}

//====================================================================================

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}

//====================================================================================

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

//====================================================================================

function postClicked(postId) {
  window.location = `./post_details.html?postId=${postId}`;
}

//====================================================================================
