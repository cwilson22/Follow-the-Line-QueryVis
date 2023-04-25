$(document).ready(function(){
  // $("#viz_area").hide();
  // $("button").click(function(){
  //   $("#viz_area").fadeIn();
  // });
  // $("#viz_area").show();
  var svg = d3.select("#viz_area");
  var data = [
    [["Select:"], ["1"], ["2"], ["3"], ["4"]],
    [["T1"], ["a", "b"], ["1", "2"], ["3", "4"], ["3", "-2"], ["2", "2"], ["4", "5"], ["1", "1"]],
    [["T2"], ["b", "c"], ["1", "3"], ["2", "1"], ["2", "2"], ["5", "5"], ["5", "8"], ["6", "22"]]
  ];
  var querytext = ["SELECT DISTINCT a", "FROM T1, T2", "WHERE T1.b = T2.b"];
  var qtextindent = [0, 0, 0];
  const emojiX = "\u274C";
  const emojiCk = "\u2705";
  var querytree = [  // TODO: COMBINE ARROWS INTO QTREE DATA. REMOVE PREV, COLORDATA
    {value: "#t0r1", all: false, children: [4, 5], prev: -1, color: 0, emoji: ""},
    {value: "#t0r2", all: false, children: [9], prev: -1, color: 0, emoji: ""},
    {value: "#t0r3", all: false, children: [12, 13], prev: -1, color: 0, emoji: ""},
    {value: "#t0r4", all: false, children: [16], prev: -1, color: 0, emoji: ""},
    {value: "#t1r2", all: false, children: [6, 7], prev: 0, color: 1, emoji: ""}, //4
    {value: "#t1r7", all: false, children: [8], prev: 0, color: 1, emoji: ""},
    {value: "#t2r3", all: false, children: [], prev: 4, color: 1, emoji: emojiCk},
    {value: "#t2r4", all: false, children: [], prev: 4, color: 1, emoji: emojiCk},
    {value: "#t2r2", all: false, children: [], prev: 5, color: 1, emoji: emojiCk},
    {value: "#t1r5", all: false, children: [10, 11], prev: 1, color: 1, emoji: ""}, //9
    {value: "#t2r3", all: false, children: [], prev: 9, color: 1, emoji: emojiCk},
    {value: "#t2r4", all: false, children: [], prev: 9, color: 1, emoji: emojiCk},
    {value: "#t1r3", all: false, children: [14], prev: 2, color: 1, emoji: ""}, //12
    {value: "#t1r4", all: false, children: [15], prev: 2, color: 1, emoji: ""},
    {value: "#t1r3", all: false, children: [], prev: 12, color: 2, emoji: emojiX},
    {value: "#t1r4", all: false, children: [], prev: 13, color: 2, emoji: emojiX},
    {value: "#t1r6", all: false, children: [17, 18], prev: 3, color: 1, emoji: ""}, //16
    {value: "#t2r5", all: false, children: [], prev: 16, color: 1, emoji: emojiCk},
    {value: "#t2r6", all: false, children: [], prev: 16, color: 1, emoji: emojiCk},
  ];
  var currentPos = [];
  var colordata = [  // r1 color (on click), r2, r3, etc.
    [0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 1]
  ];
  var selecthighlights = [0, 1, 1, 2, 1];
  const tabledata = [  // xpos, ypos, width, height, nrows, ncols, fontsize, tableid
    [100, 70, 150, 240, 5, 1, 20, 0],
    [350, 30, 200, 340, 8, 2, 20, 1],
    [650, 30, 200, 340, 8, 2, 20, 2]
  ];
  const arrowdata = [  // tableid1, row1, tableid2, row2, isdotted, prevIdx
    [0, 1, 1, 2, true, -1],
    [0, 1, 1, 7, true, -1],
    [0, 2, 1, 5, true, -1],
    [0, 3, 1, 3, true, -1],
    [0, 3, 1, 4, true, -1],
    [0, 4, 1, 6, true, -1],
    [1, 2, 2, 3, true, 0],
    [1, 2, 2, 4, true, 0],
    [1, 7, 2, 2, true, 0],
    [1, 5, 2, 3, true, 1],
    [1, 5, 2, 4, true, 1],
    [1, 3, 1, 3, true, 2],
    [1, 4, 1, 4, true, 2],
    [1, 6, 2, 5, true, 3],
    [1, 6, 2, 6, true, 3],
  ];
  $('#viz_area').click(function(e) {
    var posX = $(this).position().left, posY = $(this).position().top;
    var svg = d3.select("#viz-area");
    clickhandler(e.pageX - posX, e.pageY - posY, tabledata, colordata, arrowdata, querytree, currentPos, svg);
  });
  tabledata.forEach(function (value, i) {
    makeTable(...value, data[i], selecthighlights, svg);
  });
  findAndDrawNewArrows(tabledata, arrowdata, svg);
  makeQueryText(querytext, qtextindent, svg);
});


function makeTable(xpos, ypos, width, height, nrows, ncols, fontsize, tname, textdata, sltcolor, svgelem) {
  // console.log(xpos);
  // console.log(tname);
  // console.log(textdata);
  svgelem.append('rect')
    .attr('x', xpos)
    .attr('y', ypos)
    .attr('width', width)
    .attr('height', height)
    .attr('stroke', 'white')
    .attr('fill', 'white');
  svgelem.append('rect') // title row
    .attr('x', xpos)
    .attr('y', ypos)
    .attr('width', width)
    .attr('height', height/nrows)
    .attr("fill", "white")
    .attr("id", "t" + tname.toString() + "r0");
  if (tname != 0){
    svgelem.append('rect') // header row
      .attr('x', xpos)
      .attr('y', height/nrows + ypos)
      .attr('width', width)
      .attr('height', height/nrows)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr("fill", "lightgray")
      .attr("id", "t" + tname.toString() + "r1");
    var vi = 2;
  } else {
    var vi = 1;
  }
  // if (tname == 0){
  //   for (; vi < nrows; vi++){  // row rectangles
  //     if (sltcolor[vi] == 1){
  //       var clrst = "lightblue"
  //     } else {
  //       var clrst = "pink"
  //     }
  //     svgelem.append('rect')
  //       .attr('x', xpos)
  //       .attr('y', vi*height/nrows + ypos)
  //       .attr('width', width)
  //       .attr('height', height/nrows)
  //       .attr('stroke', 'black')
  //       .attr('stroke-width', 2)
  //       .attr("fill", clrst)
  //       .attr("id", "t" + tname.toString() + "r" + vi.toString());
  //   }
  // } else {
  for (; vi < nrows; vi++){  // row rectangles
    svgelem.append('rect')
      .attr('x', xpos)
      .attr('y', vi*height/nrows + ypos)
      .attr('width', width)
      .attr('height', height/nrows)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr("fill", "white")
      .attr("id", "t" + tname.toString() + "r" + vi.toString());
  }
  // }
  for (let i = 1; i < ncols; i++){  // column lines
    svgelem.append('line')
      .attr('x1', i*width/ncols + xpos)
      .attr('y1', height/nrows + ypos)
      .attr('x2', i*width/ncols + xpos)
      .attr('y2', height + ypos)
      .attr('stroke-width', 2)
      .attr('stroke', 'black');
  }
  svgelem.append('text')  // title
      .attr('x', xpos + 10)
      .attr('y', ypos + height/nrows - 10)
      .attr('stroke', 'black')
      // .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'bottom')
      .style("font-size", fontsize+15)
      .style("font-family", "Helvetica")
      .text(textdata[0][0]);
  // for (let j = 0; j < ncols; j++){ // headers
  //   svgelem.append('text')
  //     .attr('x', j*width/ncols + xpos + 10)
  //     .attr('y', height/nrows + ypos + height/nrows/2)
  //     .attr('stroke', 'black')
  //     // .attr('text-anchor', 'middle')
  //     .attr('dominant-baseline', 'middle')
  //     .style("font-size", fontsize+5)
  //     .style("font-family", "Helvetica")
  //     .text(textdata[1][j])
  // }
  if (tname == 0){
    for (let i = 1; i < nrows; i++){
      for (let j = 0; j < ncols; j++){
        if (sltcolor[i] == 1){
          var clrst = "darkgreen";
        } else if (sltcolor[i] == 2) {
          var clrst = "darkred";
        } else {
          var clrst = "black";
        }
        svgelem.append('text')
          .attr('x', j*width/ncols + xpos + 10)
          .attr('y', i*height/nrows + ypos + height/nrows/2)
          .attr('stroke', clrst)
          // .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style("font-size", fontsize)
          .style("font-family", "Helvetica")
          .style("color", clrst)
          .text(textdata[i][j]);
      }
    }
  } else {
    for (let i = 1; i < nrows; i++){
      for (let j = 0; j < ncols; j++){
        svgelem.append('text')
          .attr('x', j*width/ncols + xpos + 10)
          .attr('y', i*height/nrows + ypos + height/nrows/2)
          .attr('stroke', 'black')
          // .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style("font-size", fontsize)
          .style("font-family", "Helvetica")
          .text(textdata[i][j]);
      }
    }
  }
}

function makeQueryText(qtextlines, indents, svgelem){
  for (let j = 0; j < qtextlines.length; j++){
    svgelem.append('text')
      .attr('x', 100 + 20 * indents[j])
      .attr('y', j*20 + 600)
      .attr('stroke', 'black')
      // .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('id', 'qtxt' + j.toString())
      .style("font-size", 20)
      .style("font-family", "courier")
      .text(qtextlines[j]);
  }
}

function findAndDrawNewArrows(tdata, adata, svg){
  let i = 0;
  for (adat of adata){
    if (tdata[adat[0]][0] + tdata[adat[0]][2] < tdata[adat[2]][0]){
      xs = tdata[adat[0]][0] + tdata[adat[0]][2];
      ys = tdata[adat[0]][1] + tdata[adat[0]][3]*(2*adat[1] + 1)/(2*tdata[adat[0]][4]);
      xf = tdata[adat[2]][0];
      yf = tdata[adat[2]][1] + tdata[adat[2]][3]*(2*adat[3] + 1)/(2*tdata[adat[2]][4]);
      drawArrow(xs, ys, (xf + xs)/2, ys, (xf + xs)/2, yf, xf, yf, adat[4], "a" + i.toString(), svg);
    } else if (tdata[adat[0]][0] > tdata[adat[2]][0] + tdata[adat[2]][2]){
      xf = tdata[adat[0]][0];
      yf = tdata[adat[0]][1] + tdata[adat[0]][3]*(2*adat[1] + 1)/(2*tdata[adat[0]][4]);
      xs = tdata[adat[2]][0] + tdata[adat[2]][2];
      ys = tdata[adat[2]][1] + tdata[adat[2]][3]*(2*adat[3] + 1)/(2*tdata[adat[2]][4]);
      drawArrow(xs, ys, (xf + xs)/2, ys, (xf + xs)/2, yf, xf, yf, adat[4], "a" + i.toString(), svg);
    } else if (adat[0] == adat[2] && adat[1] == adat[3]){
      xs = tdata[adat[0]][0] + tdata[adat[0]][2];
      ys = tdata[adat[0]][1] + tdata[adat[0]][3]*(2*adat[1] + 1)/(2*tdata[adat[0]][4]);
      drawArrow(xs, ys, xs + 50, ys + 50, xs + 50, ys - 50, xs, ys, adat[4], "a" + i.toString(), svg);
    } else {
      xs = tdata[adat[0]][0] + tdata[adat[0]][2];
      ys = tdata[adat[0]][1] + tdata[adat[0]][3]*(2*adat[1] + 1)/(2*tdata[adat[0]][4]);
      xf = tdata[adat[2]][0] + tdata[adat[2]][2];
      yf = tdata[adat[2]][1] + tdata[adat[2]][3]*(2*adat[3] + 1)/(2*tdata[adat[2]][4]);
      drawArrow(xs, ys, Math.max(xs, xf) + 70, ys, Math.max(xs, xf) + 70, yf, xf, yf, adat[4], "a" + i.toString(), svg);
    }
    i += 1;
  }
  for (let i = 1; i < tdata.length; i++){  // emoji boxes (draw above arrows)
    for (let j = 2; j < tdata[i][4]; j++){
      svg.append('text')
        .attr('x', tdata[i][2] + tdata[i][0] + 20)
        .attr('y', j*tdata[i][3]/tdata[i][4] + tdata[i][1] + tdata[i][3]/tdata[i][4]/2)
        .attr('stroke', 'black')
        .attr('id', "t" + i.toString() + "r" + j.toString() + "em")
        // .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style("font-size", 32)
        .style("font-family", "Helvetica")
        .text("");
    }
  }
}

function drawArrow(x1, y1, x2, y2, x3, y3, x4, y4, isdotted, name, svg){
  svg.append("defs").append('marker')
    .attr('viewBox', [0, 0, 5, 5])
    .attr('refX', 5)
    .attr('refY', 2.5)
    .attr('id', 'mk' + name)
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', d3.line()([[0, 0], [0, 5], [5, 2.5]]))
    .attr('id', 'm' + name)
    .attr("fill", "transparent")
    .attr('stroke', 'transparent');
  if (isdotted) {
    svg.append('path')
      .attr("stroke-width", 3)
      .attr("stroke", "transparent")
      .attr("id", name)
      .attr("marker-end", "url(#mk" + name + ")")
      .attr("fill", "transparent")
      .style("stroke-dasharray", ("3, 3"))
      .attr("d", "M " + x1.toString() + " " + y1.toString() + " C " + x2.toString() + " " + y2.toString() + ", " + x3.toString() + " " + y3.toString() + ", " + x4.toString() + " " + y4.toString());
  } else {
    svg.append('path')
      .attr("stroke-width", 3)
      .attr("stroke", "transparent")
      .attr("id", name)
      .attr("marker-end", "url(#mk" + name + ")")
      .attr("fill", "transparent")
      .attr("d", "M " + x1.toString() + " " + y1.toString() + " C " + x2.toString() + " " + y2.toString() + ", " + x3.toString() + " " + y3.toString() + ", " + x4.toString() + " " + y4.toString());
  }
}

function clickhandler(xpos, ypos, tdata, cdata, adata, qtree, curPos, svg){
  console.log(xpos, ypos);
  for (row of tdata){
    if (xpos > row[0] && xpos < row[2] + row[0] && ypos > row[1] && ypos < row[3] + row[1]){
      let id = "#t" + row[7].toString() + "r" + Math.trunc((ypos - row[1])/(row[3]/row[4])).toString();
      let rnum = Math.trunc((ypos - row[1])/(row[3]/row[4]));
      console.log(id);
      if (id.substring(0, 3) == "#t0"){
        turnOffAllOthers(id, cdata[row[7]][rnum], adata, qtree);
        curPos.length = 0;
        let val = findObjInTree(id, qtree);
        console.log(val);
        curPos.push(val);
      } else {
        var found = false;
        for (let i = curPos.length - 1; i >= 0; i--){
          if (!found){
            console.log("hi2", i, qtree[curPos[i]]);
            for (adjInd of qtree[curPos[i]].children){
              console.log(id, adjInd, i, curPos);
              if (qtree[adjInd].value == id){  // found!
                // pop curPos down to position if all=false, curpos[i] is head, adjInd is clicked box
                let lsto = curPos.length;
                console.log(id, adjInd, i, curPos);
                if (!qtree[curPos[i]].all){
                  for (j = lsto - 1; j > i; j--){
                    turnOffBox(qtree[curPos[j]].value, adata);
                    curPos.pop();
                  }
                }
                found = true;
                turnOnBox(id, qtree[adjInd].color, qtree[adjInd].emoji, adata, curPos[i]);
                curPos.push(adjInd);
                if (qtree[adjInd].emoji != "") {
                  // setTimeout(backtrack, 2000, adjInd, qtree);
                  backtrack(adjInd, qtree);
                }
                break;
              }
            }
          }
        }
      }
    }
  }
  console.log(curPos);
}

function turnOnBox(id, clr, emoji, adata, prevIdx){
  console.log("previous idx:", prevIdx)
  tid = parseInt(id[2]);
  rid = parseInt(id.substring(4));
  adata.forEach(function (arrow, i){
    if (arrow[0] == tid && arrow[1] == rid && arrow[5] == prevIdx){
      d3.select("#a" + i.toString()).attr("stroke", "black");
      d3.select("#ma" + i.toString()).attr("fill", "black").attr("stroke", "black");
    }
  });
  if (clr == 1){
    d3.select(id).style("fill", "lightblue");
  }else if (clr == 2){
    d3.select(id).style("fill", "pink");
  }
  if (emoji != ""){
    d3.select(id + "em").text(emoji);
  }
}

function turnOffBox(id, adata){
  tid = parseInt(id[2]);
  rid = parseInt(id.substring(4));
  adata.forEach(function (arrow, i){
    if (arrow[0] == tid && arrow[1] == rid){
      d3.select("#a" + i.toString()).attr("stroke", "transparent");
      d3.select("#ma" + i.toString()).attr("fill", "transparent").attr("stroke", "transparent");
    }
  });
  d3.select(id + "em").text("");
  d3.select(id).style("fill", "white");
}

function turnOffAllOthers(id, clr, adata, qtree){
  for (sq of qtree){
    turnOffBox(sq.value, adata);
  }
  turnOnBox(id, clr, "", adata, -1);
}

function findObjInTree(id, qtree){
  let target = -1;
  qtree.forEach(function(sq, i){
    if (sq.value == id){
      target = i;
    }
  });
  return target;
}

function backtrack(curqtreeInd, qtree){
  var one_seen = false;
  var one_seen_item = qtree[curqtreeInd];
  var cur_index = curqtreeInd;
  var cur_obj = qtree[curqtreeInd];
  while (true){
    if (one_seen && one_seen_item.value != qtree[cur_index].value && qtree[cur_index].color == 2){
      d3.select(one_seen_item.value).transition().duration(200).style("fill", "white").transition().duration(1000).style("fill", "lightblue");
      d3.select(cur_obj.value).transition().duration(200).style("fill", "white").transition().duration(1000).style("fill", "lightblue");
      one_seen = false;
    } else if (qtree[cur_index].color == 2){
      one_seen = true;
      one_seen_item = qtree[cur_index];
    }
    if (cur_obj.prev == -1){
      break;
    }
    cur_index = cur_obj.prev;
    cur_obj = qtree[cur_obj.prev];
  }
}