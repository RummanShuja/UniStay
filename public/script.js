
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
      if (parent.style.opacity === "0.6") {
        hiddenInp.disabled = true;
        parent.style.opacity = 1;
        totalImg++;
      }
      else {
        if (totalImg > 1) {
          totalImg--;
          hiddenInp.disabled = false;
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

// image in big size
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
// compression function
async function compressImage(file, maxWidth = 1000, quality = 0.5) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = maxWidth / width * height;
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
              resolve(compressedFile);
            }
            else {
              reject(new Error("Compression failed"));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

// handling both new listing form and edit listing form (compressing, limiting images, showing uploading message)
let listingForm = document.querySelector('#ListingForm');
if (listingForm) {
  listingForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // displaying uploading message5
    const status = document.querySelector("#status");
    status.style.display = "block";


    let imageInput = document.querySelector(".imageInput");
    let hiddenInputCount = document.querySelectorAll('input[type="hidden"][disabled]').length;
    imageInput.addEventListener("change", () => {
      if (imageInput.style.color === "red") {
        imageInput.style.color = "black";
      }
    })
    const fileInput = document.querySelector('#image');
    const files = Array.from(fileInput.files);
    const totalImages = files.length + hiddenInputCount;
    if (totalImages > 6 || totalImages < 1) {
      imageInput.style.color = "red";
      const toastLiveExample = document.getElementById('liveToast')
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
      toastBootstrap.show();
      status.style.display = "none";
      return;
    }


    // compress in parallel
    const compressionTasks = files.map(f => {
      if (f.size > 1 * 1024 * 1024) {
        return compressImage(f, 1000, 0.5); // returns a File
      }
      return Promise.resolve(f);
    });

    let compressedFiles;
    try {
      compressedFiles = await Promise.all(compressionTasks);
    } catch (err) {
      console.error("Compression error:", err);
      if (status) status.style.display = "none";
      alert("Image compression failed. Please try again.");
      return;
    }
    // Replace the input's files with compressed files
    const dt = new DataTransfer();
    compressedFiles.forEach(f => dt.items.add(f));
    fileInput.files = dt.files;

    

     // Set timers for post-submit waiting
    const timer5s = setTimeout(() => {
      status.innerText = "Almost done... just a few more seconds.";
      status.style.color = "orange";
    }, 5000);

    const timer12s = setTimeout(() => {
      status.innerText = "Still processing... might take longer due to network or server load.";
      status.style.color = "red";
    }, 12000);


    // Now submit the form so the server can redirect
    this.submit();


  });
}


