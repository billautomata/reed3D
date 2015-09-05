(function go(){

  fetch('list.json').then(function(response){
    return response.json()
  }).then(function(json){

    if(window.location.hash.length === 0){
      // no hash passed, render the index
      render_index(json)

    } else {
      // hash passed, render the correct one
      json.forEach(function(element, element_idx){
        if(window.location.hash.length !== 0){
          var k = window.location.hash.split('#')[1]
          if(element === k){
            fetch('models/' + element + '/index.json').then(function(r){
              return r.json()
            }).then(function(json){
              console.log(json)
              render(json)
            })
          }
        }
      })
    }




  })

})()
