use strict;

OKHS = [];
OKWS = [];

OKHS[0] = { name: "first OKH" };

OKWS[0] = { name: "first OKW" };

function registerOKH(name,number,desc) {
  var table = document.getElementById("okh_table");

  var row = table.insertRow(-1);

  row.id = number;
  row.setAttribute("class_num", class_num);
  row.setAttribute("solid_name", name);

  var cnt = 0;
  var name_c = row.insertCell(cnt++);
    var desc_c = row.insertCell(cnt++);
var button_c = row.insertCell(cnt++);

  button_c.innerHTML = "<button onclick='renderOKH(\""+
    number")'>Go</button>";
}


function runUnitTests() {
    registerOKH(OKH[0]);
    alert("no tests yet!");
}

$(registerOKH(OKH[0]));
