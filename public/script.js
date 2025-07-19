
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
// const uploadForm = document.querySelector('.upload_form');
// if (uploadForm) {
//   uploadForm.addEventListener("submit", () => {
//     const status = document.querySelector("#status");
//     status.style.display = "block";
//   })
// }

// //bookmarking listing with out reload
// let allBookmark = document.querySelectorAll(".cardBody > .save .fa-bookmark");
// if (allBookmark) {

//   allBookmark.forEach((bookmark) => {
//     bookmark.addEventListener("click", async () => {
//       try {

//         if (bookmark.id === "login") {
//           const toastLiveExample = document.getElementById('liveToast')
//           const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
//           toastBootstrap.show();
//         }
//         else {
//           const response = await fetch(`/save/${bookmark.id}`, {
//             method: "POST"
//           });
//           if (response.ok) {
//             bookmark.classList.toggle("fa-regular");
//             bookmark.classList.toggle("fa-solid");
//           }
//         }
//       }
//       catch (err) {
//         next(err);
//       }
//     })
//   })
// }

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

// handling image compression in client side
// let formUpload = document.querySelector(".upload_form");
// if(formUpload){
//   formUpload.addEventListener('submit',async function(e){
//     e.preventDefault();
//     const fileInput = document.querySelector('input[type="file"]');
//     const files = fileInput.files;
//     // const form = this;
//     if(!files.length){
//       form.submit();
//       return;
//     }
//     const options ={
//       maxSizeMB: 0.6,
//       maxWidthOrHeight: 1200,
//       useWebWorker: true
//     };
//     const compressedFiles = [];
//     for(let file of files){
//       try{
//         const compressedFile = await imageCompression(file, options);
//         compressedFiles.push(compressedFile);
//       }catch(err){
//         console.log("Compression failed: ",err.message);
//         compressedFiles.push(file);
//       }
//     }
//     // console.log("compressedFiles",compressedFiles);
//     const formData = new FormData(this);
//     console.log(formData);


//   })
// } 
// handling compression using canvas

// compression function
async function compressImage(file, maxWidth = 1200, quality = 0.6) {
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

// handling new listing form (compressing)
let newListingForm = document.querySelector('#newListingForm');
if(newListingForm){
  newListingForm.addEventListener('submit',async function(e){
    e.preventDefault();
    const files = Array.from(document.querySelector('#image').files);
    const compressFiles = await Promise.all(
      files.map(file => file.size > 1*1024*1024 ? compressImage(file, 1200, 0.6) : Promise.resolve(file))
    );
    
    const formData = new FormData(this);
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    formData.delete('listing[image]');
    compressFiles.forEach((file)=>{
      formData.append('listing[image]',file);
    })

    try{
      const response = await fetch(this.action, {
        method: "POST",
        body: formData
      });

      if(response.ok){
        window.location.href = '/listings';
      }else{
        console.log("upload failed!");
      }
    }
    catch(err){
      console.log("Upload Error: ",err.message);
    }
  });
}