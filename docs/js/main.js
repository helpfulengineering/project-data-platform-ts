

OKHS = [];
OKWS = [];

OKHS[0] = { name: "first OKH" };

OKWS[0] = { name: "first OKW" };

function registerOKH(okh) {

//    var xxx = document.getElementById("xxx");


  var table = document.getElementById("okh_table");

  var row = table.insertRow(-1);

  row.id = okh.number;
  row.setAttribute("number", okh.number);
  row.setAttribute("solid_name", okh.name);

  var cnt = 0;
    var name_c = row.insertCell(cnt++);
    var desc_c = row.insertCell(cnt++);
var button_c = row.insertCell(cnt++);

    name_c.innerHTML = okh.name;
    desc_c.innerHTML = okh.desc;
  button_c.innerHTML = "<button onclick='renderOKH(\""+
    okh.number+")'>Go</button>";
}


function runUnitTests() {
    registerOKH(OKH[0]);
    alert("no tests yet!");
}

$(registerOKH(OKHS[0]));
