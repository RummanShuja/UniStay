
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {

    form.addEventListener('submit', event => {
      let inps = form.querySelectorAll(".noWhiteSpace");
      let isEmpty = true;
      for (let inp of inps) {
        isEmpty = isEmpty && inp.value.trim() !== "";
      }

      if (!form.checkValidity() || !isEmpty) {
        if (!isEmpty && form.checkValidity()) {
          alert("you cant pass whitespace in input field");
        }

        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
// limit deletion of all images
let deleteImg = document.querySelectorAll(".deleteImg");
let totalImg = deleteImg.length;
if (deleteImg) {

  deleteImg.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      let parent = e.target.closest(".editImages");
      let hiddenInp = parent.querySelector('input[type="hidden"]');
      let editImgName = parent.querySelector(".editImgName");
      if (parent.style.opacity === "0.6") {
        hiddenInp.disabled = true;
        editImgName.querySelector("input").disabled = false;
        parent.style.opacity = 1;
        totalImg++;
      }
      else {
        if (totalImg > 1) {
          totalImg--;
          hiddenInp.disabled = false;
          editImgName.querySelector("input").disabled = true;
          parent.style.opacity = 0.6;
        }
        else {
          const toastLiveExample = document.getElementById('liveToast')
          const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
          toastBootstrap.show();
        }
      }
    })
  });
}

// limiting image upload and showing 'please wait images are uploading' this is only for new.ejs
let form = document.querySelector(".checkImageCount");
let imageInput = document.querySelector(".imageInput");
if (form) {

  form.addEventListener("submit", (e) => {
    const status = document.querySelector("#status");
    status.style.display = "block";

    if (imageInput.files.length > 6 || imageInput.files.length < 1) {
      e.preventDefault();
      imageInput.style.color = "red";
      const toastLiveExample = document.getElementById('liveToast')
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
      toastBootstrap.show();
    }
  })
  imageInput.addEventListener("change", () => {
    if (imageInput.style.color === "red") {
      imageInput.style.color = "black";
    }
  })
}

//please wait images are uploading in edit.ejs
const uploadForm = document.querySelector('.upload_form');
if (uploadForm) {
  uploadForm.addEventListener("submit", () => {
    const status = document.querySelector("#status");
    status.style.display = "block";
  })
}

//bookmarking listing with out reload
let allBookmark = document.querySelectorAll(".cardBody > .save .fa-bookmark");
if (allBookmark) {

  allBookmark.forEach((bookmark) => {
    bookmark.addEventListener("click", async () => {
      try {

        if (bookmark.id === "login") {
          const toastLiveExample = document.getElementById('liveToast')
          const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
          toastBootstrap.show();
        }
        else {
          const response = await fetch(`/save/${bookmark.id}`, {
            method: "POST"
          });
          if (response.ok) {
            bookmark.classList.toggle("fa-regular");
            bookmark.classList.toggle("fa-solid");
          }
        }
      }
      catch (err) {
        next(err);
      }
    })
  })
}

//disable-interested-btn
let disableInterestedBtn = document.querySelector(".disable-interested-btn");
if (disableInterestedBtn) {

  disableInterestedBtn.addEventListener("click", () => {
    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show();
  })
}






const thumbnails = document.querySelectorAll('.listing-thumbnail');
const modalImage = document.getElementById('modalImage');
const nextBtn = document.getElementById('nextImage');
const prevBtn = document.getElementById('prevImage');

const imageUrls = Array.from(thumbnails).map(img => img.getAttribute('data-image'));
let currentIndex = 0;

if (thumbnails) {
  thumbnails.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = parseInt(img.getAttribute('data-index'));
      modalImage.src = imageUrls[currentIndex];
    });
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imageUrls.length;
    modalImage.src = imageUrls[currentIndex];
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    modalImage.src = imageUrls[currentIndex];
  });
}
