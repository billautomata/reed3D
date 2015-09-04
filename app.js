(function go(){

  fetch('list.json').then(function(response){
    return response.json()
  }).then(function(json){
    console.log(json)

    var list_array = json

    list_array.forEach(function(element, element_idx){

      fetch('models/' + element + '/index.json').then(function(r){
        return r.json()
      }).then(function(json){

        console.log(json)

        if(element_idx === 0){
          render(json)
        }

      })

    })

  })

})()
