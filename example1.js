$(document).ready(function(){
  $("#viz_area").hide();
  $("button").click(function(){
    $("#viz_area").fadeIn();
  });
  $('#viz_area').click(function(e) {
    var posX = $(this).position().left,posY = $(this).position().top;
    var svg = d3.select("#viz-area");
    clickhandler(e.pageX - posX, e.pageY - posY, svg);
  });
  var svg = d3.select("#viz_area");
  var data = [["asdf", "as", "aa", "asdfasf"],["1asdf", "asdf", "r2c3", "asdf"], ["1234", "12", "2134", "234"]];
  makeTable(10, 10, 600, 400, 4, 4, 20, data, svg);
});


function makeTable(xpos, ypos, width, height, nrows, ncols, fontsize, textdata, svgelem) {
  svgelem.append('rect')
    .attr('x', xpos)
    .attr('y', ypos)
    .attr('width', width)
    .attr('height', height)
    .attr('stroke', 'black')
    .attr('fill', 'white');
  for (let i = 1; i < nrows; i++){
    svgelem.append('line')
      .attr('x1', xpos)
      .attr('y1', i*(height - ypos)/nrows + ypos)
      .attr('x2', width + xpos)
      .attr('y2', i*(height - ypos)/nrows + ypos)
      .attr('stroke', 'black');
  }
  for (let i = 1; i < ncols; i++){
    svgelem.append('line')
      .attr('x1', i*(width - xpos)/ncols + xpos)
      .attr('y1', ypos)
      .attr('x2', i*(width - xpos)/ncols + xpos)
      .attr('y2', height + ypos)
      .attr('stroke', 'black');
  }
  for (let i = 0; i < nrows; i++){
    for (let j = 0; j < ncols; j++){
      svgelem.append('text')
        .attr('x', j*(width - xpos)/ncols + xpos + 10)
        .attr('y', i*(height - ypos)/nrows + ypos + (height - ypos)/nrows/2)
        .attr('stroke', 'black')
        .style("font-size", fontsize)
        .text(textdata[i][j])
    }
  }
}

function clickhandler(xpos, ypos, svg){
  svg.
}