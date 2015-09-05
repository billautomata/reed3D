(function go(){

  fetch('list.json').then(function(response){
    return response.json()
  }).then(function(json){
    console.log(json)

    var list_array = json

    list_array.forEach(function(element, element_idx){

      if(window.location.hash.length !== 0){
        // picked hash
        var k = window.location.hash.split('#')[1]
        console.log(k)

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

  })

})()
