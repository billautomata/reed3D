function render_index(json){

  console.log(json)

  var body = d3.select('body').append('div').attr('class', 'container')

  json.forEach(function(element){

    var parent = body.append('div').attr('class', 'box').html(element)
    parent.on('click', function(){
      window.location.hash = '#' + element
      window.location.reload(true)
    })

  })


}
