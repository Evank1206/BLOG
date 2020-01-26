document.getElementById('btn').onclick = function (e){
  e.preventDefault();
  let formData = new FormData();

  formData.append('image', document.getElementById("file").files[0]);
  formData.append('subheadline', document.getElementById("subHead").value);
  formData.append('body', document.getElementById("textArea").value);
  formData.append('headline', document.getElementById("articleHead").value);

  axios.post( '/article',
    formData,
    {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    }
  ).then(function(response){

    window.location = response.data;
  })
  .catch(function(e){
    console.log('FAILURE!!', e);
  });

}

// comment section
window.onload = function(){ 
  document.getElementById('submit Btn').onclick = function(e){
    console.log('>>>ONCLICK');
      e.preventDefault();
    const comment = document.getElementById('userCommentInput').value;
  
    console.log(comment);
    
  }
};