window.onload = welcome

function goToCreatePost(){
    window.location.href = '/user/goToCreatePost'
}

const fileInput = document.getElementById('file');
const type = document.getElementById('')
const newsfeed = document.getElementById('newsfeed')

// fileInput.addEventListener('change', () => { 
//   const file = fileInput.files[0];
//   const fileName = file.name.toLowerCase();
//   const validExtensions = ['jpg', 'jpeg', 'png','gif','bmp','tiff','tif','psv','svg','webp','ico','heic','mp4','avi','mkv','mov','wmv','flv','mpeg','mpg','webm','3gp','ts'];

//   if (!validExtensions.includes(fileName.split('.').pop())) {
//     alert('Invalid file type. Please select a JPG, JPEG or PNG file.');
//     fileInput.value = '';
//   }
// });

fileInput.addEventListener('change', function() {
if (this.files.length > 0) {
  document.querySelector('input[value="CONTENT"]').value = "RESOURCE";
  document.querySelector('label[for="gridRadios1"]').innerText = "Resource";
} else {
  document.querySelector('input[value="RESOURCE"]').value = "CONTENT";
  document.querySelector('label[for="gridRadios1"]').innerText = "Content";
}
});

fileInput.addEventListener('change',function(){
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name.toLowerCase();
      console.log(fileName)
      console.log(fileName.split('.').pop())
      const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'psv', 'svg', 'webp', 'ico', 'heic'];
      const validVideoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'mpeg', 'mpg', 'webm', '3gp', 'ts'];
      if (validImageExtensions.includes(fileName.split('.').pop()) || validVideoExtensions.includes(fileName.split('.').pop())) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        if (validImageExtensions.includes(fileName.split('.').pop())) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                previewItem.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else if (validVideoExtensions.includes(fileName.split('.').pop())) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.style.maxWidth = '100px';
            video.style.maxHeight = '100px';
            video.controls = true;
            previewItem.appendChild(video);
        }

        // Create caption input
        const captionInput = document.createElement('input');
        captionInput.type = 'text';
        captionInput.placeholder = 'Enter caption';
        captionInput.name = `caption-${i}`;

        preview.appendChild(previewItem);
        preview.appendChild(captionInput);
    }else{
      alert('Invalid file type. Please select a JPG, JPEG or PNG file.');
      document.querySelector('input[value="RESOURCE"]').value = "CONTENT";
      document.querySelector('label[for="gridRadios1"]').innerText = "Content";
      fileInput.value = '';
    }
      
    
  }
})
 

async function createPost(){ 
   
    let data = new FormData(document.getElementById('postForm'))
    let file = document.getElementById('file').files
    let captions = [];
    for(let i=0;i<file.length;i++){
      data.append('files',file[i])
      const captionInput = document.querySelector(`input[name="caption-${i}"]`);
      if (captionInput) {
          captions.push(captionInput.value + '');
      }else{
        captions.push('')
      }
    }
    data.append('captions', captions);
    console.log(data) 
    console.log(Object.fromEntries(data.entries())) 
    let response = await fetch('/post/createPublicPost',{
        method : 'POST',
        body : data
    })
    document.getElementById('postForm').reset()
    document.getElementById('groupSelect').innerHTML = ''
    console.log(response)
    welcome()
}


async function welcome(){
  let data = await fetch('/post/getAll',{
    method : 'GET'
    })
    let response = await data.json()
    console.log(response)
 
    let posts = ''
    if(response.length === 0){
      newsfeed.innerHTML = `<div>No Posts Available</div>`
    }else{
      response.forEach(p=>{
       
        let post = ''
       post += `

      <div class="post">
      <div class="post-top">
          <div class="dp">
              <img src="${p.user.photo}" alt="">
          </div>
          <div class="post-info">
              <p class="name">${p.user.name}</p>
              <span class="time">2 days ago</span>
          </div>
          <i class="fas fa-ellipsis-h "></i>
      </div>
      <div class=" post-content">
          ${p.description}
          <div id="${p.id}" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">`


                p.resources.forEach((r,index)=>{
                  let active = index == 0 ? 'active' : ''
                  if(r.photo === null && r.video !== null){
                    post += `<div  style="width: 500px; height: 300px; overflow: hidden;" class="carousel-item ${active}" style=>
                    <b>${r.description}</b>
                    <video controls style="border-radius: 20px; width: 100%; height: 100%; object-fit: cover;" src="${r.video}" class="d-block " alt="..."></video>
                  </div>`
                  }else
                  if(r.video === null && r.photo !== null){
                    post += `<div  style="width: 500px; height: 300px; overflow: hidden;" class="carousel-item ${active}">
                    <b>${r.description}</b>
                    <img src="${r.photo}" style="border-radius: 20px; width: 100%; height: 100%; object-fit: cover;" class="d-block " alt="...">
                  </div>`
                  }else{
                    post += `<div  style="width: 500px; height: 300px; overflow: hidden;" class="carousel-item ${active}">
                    <b>${r.description}</b>
                    <video controls src="${r.video}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;" class="d-block" alt="..."></video>
                  </div>`
                  post += `<div  style="width: 500px; height: 300px; overflow: hidden;" class="carousel-item ${active}">
                  <b>${r.description}</b>
                  <img src="${r.photo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px; " class="d-block" alt="...">
                </div>
                </div>`
                  }
                 
                })
                if(p.resources.length>1){
                post+=  `
                  <button class="carousel-control-prev" type="button" data-bs-target="#${p.id}" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${p.id}" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>`
                }
              post+= `
             
            </div>
      </div>
      <div class="post-bottom">
          <div class="action">
              <i class="fa-regular fa-thumbs-up"></i>
              <span>Like</span>
          </div>
          <div class="action">
              <i class="fa-regular fa-comment"></i>
              <span>Comment</span>
          </div>
          <div class="action">
              <i class="fa fa-share"></i>
              <span>Share</span>
          </div>
      </div>
  </div>`

        posts += post
      })
      newsfeed.innerHTML = posts
    }
    // console.log(data.json())
}

async function createEventPost(event) {
  var startDate = new Date(document.getElementById('start_date').value);
  var endDate = new Date(document.getElementById('end_date').value);

  if (startDate > endDate) {
    alert('Start date must be earlier than end date.');
    event.preventDefault();
  } else {
    event.preventDefault(); // prevent the form from being submitted immediately
    let data = new FormData(document.getElementById('eventForm'));
    console.log(data);
    let response = await fetch('/event/createEvent', {
      method: 'POST',
      body: data
    });
    let result = await response.json();
    console.log(result);
    welcome()
  }
}

document.getElementById('eventForm').addEventListener('submit', function(event) {
  createEventPost(event);
  document.getElementById('eventForm').reset()
})


async function getAllUserGroup(num){
  let groups = document.getElementById('groupSelect'+num)
let data = await fetch('/api/community/loginUserGroups')
let result = await data.json()
console.log(result)
let group = ''
result.forEach((r,index)=>{
  let active = index === 0 ? 'selected' : ''
 
   group += 
  `
 
  <option ${active}  value='${r.id}'>${r.name}</option> 

  `
})

  groups.innerHTML = group
}

