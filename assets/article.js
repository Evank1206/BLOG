document.getElementById('submitBtn').onclick = function (e){
  e.preventDefault();
  let formData = new FormData();

  formData.append('comment', document.getElementById("userCommentInput").value);
  formData.append('id', id);

  axios.post( '/comment',
    formData,
    {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    }
  ).then(function(response){

    window.location.reload();
  })
  .catch(function(e){
    console.log('FAILURE!!', e);
  });

}