/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/
*/
function xml2json(xml, tab) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType);
         return o;
      },
      toJson: function(o, name, ind) {
         var json = name ? ("\""+name+"\"") : "";
         if (o instanceof Array) {
            for (var i=0,n=o.length; i<n; i++)
               o[i] = X.toJson(o[i], "", ind+"\t");
            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
         }
         else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            var arr = [];
            for (var m in o)
               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\"";
         else
            json += (name&&":") + o.toString();
         return json;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}


import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";


// Possibly this is a better thing to try:
// https://github.com/abdolence/x2js

// START CODE FROM AWS:
// **DO THIS**:
//   Replace BUCKET_NAME with the bucket name.
//
// var albumBucketName = "BUCKET_NAME";
var albumBucketName = "github-helpfulengineering-library";


// This worked...
// fetch('https://s3.amazonaws.com/my-bucket/example.txt')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.text();
//   })
//   .then(data => {
//     console.log(data); // Do something with the content of the file
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });



example_id = '8fb8567d3a69838c469b205b7cf70b8c1abeddf0cdc9fd63f367006b6fc78262';



function robTriesToUseHarrysClientSideS3() {

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(
        {
            IdentityPoolId: 'THIS IS A FAKE ID',
            IdentityId: 'THIS IS A FAKE ID',
        }
    );

    // Create S3 service object
    var s3 = new AWS.S3();

    const params = {
        Bucket: albumBucketName,
        Key: 'alpha/okh/okh-Character-Generator.yml'
    };

    s3.getObject(params, (err, data) => {
  if (err) {
    console.error('Error retrieving object:', err);
  } else {
    console.log('Object data:', data.Body.toString());
  }
});

    // Call S3 to list the buckets
    s3.listObjects({ Bucket: albumBucketName }, function (err, data) {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Success', data);
        }
    });


    region = "us-east-2";
    releaseName = "debug-proxy";
    //    regexVersion = new RegExp(`^${this.releaseName}\/(?<Version>.*)\/$`);

    // Note: Using an identity signer function is a workaround for an AWS SDk issue
    // https://github.com/aws/aws-sdk-js-v3/issues/2321#issuecomment-916336230
    var s3 = S3Client({
      region: region,
      signer: { sign: (request) => Promise.resolve(request) }
    });
}


// List the photo albums that exist in the bucket.
function listAlbums() {
  s3.listObjects({ Delimiter: "/" }, function (err, data) {
    if (err) {
      return alert("There was an error listing your albums: " + err.message);
    } else {
      var albums = data.CommonPrefixes.map(function (commonPrefix) {
        var prefix = commonPrefix.Prefix;
        var albumName = decodeURIComponent(prefix.replace("/", ""));
        return getHtml([
          "<li>",
          '<button style="margin:5px;" onclick="viewAlbum(\'' +
            albumName +
            "')\">",
          albumName,
          "</button>",
          "</li>",
        ]);
      });
      var message = albums.length
        ? getHtml(["<p>Click on an album name to view it.</p>"])
        : "<p>You do not have any albums. Please Create album.";
      var htmlTemplate = [
        "<h2>Albums</h2>",
        message,
        "<ul>",
        getHtml(albums),
        "</ul>",
      ];
      document.getElementById("viewer").innerHTML = getHtml(htmlTemplate);
    }
  });
}
// END CODE FROM AWS

OKHS = [];
OKWS = [];

OKHS[0] = { name: "first OKH" };

VENTMON_EXAMPLE_WIRED_OKH = {
    title: "VentMon v0.4T",
description: "The VentMon is basically a cloud-enable spirometer with an FiO2 sensor. It can\
  simply be plugged into a standard 22mm airway and provides a rich stream of\
  pressure, flow, and Oxygen sensor, with humidity and temperature sensing as\
  well. The primary use of the VentMon is by engineering teams developing\
  pandemic response ventilators and other respiration tools. Secondarily, it is\
  completely and transparently open source, so any team can adopt the design and\
  incorporate it into their own devices to provide the same data in an\
  integrated way.",
    intended_use: "The original purpose of the VentMon was to support pandemic response teams\
  creating emergency ventilators. Interposed between a ventilator under test and\
  a plastic test lung, it provides a display similar to the clinical display on\
  modern ventilators, allow engineers to validate all mechanical function of the\
  ventilators. Additionally, it compute rise time as a performance metric. It\
  produces data in the PIRDS standard, which can be logged and is later\
  processed by the VentDisplay software.",
keywords: [
    "ventilation",
    "spirometry",
    "pandemic response",
    "arduino",
    "open source",
    "free software"],
    project_link: "https://github.com/PubInv/ventmon-ventilator-inline-test-monitor",
    image: "https://user-images.githubusercontent.com/5296671/113649478-1e9da800-9654-11eb-934b-7e8a9a5c5bfe.JPG",
    made: "true",
    made_independently: "false",
    license: {
        hardware: "CERN-OHL-1.2",
        documentation: "CC0-1.0",
        software: "GPL-3.0-only"},
    licensor: {
        name: "Robert L. Read",
        affiliation: "Public Invention (https://www.pubinv.org/)",
        email: "read.robert@gmail.com"
    },
    okh_manifest_version: "1.0.0",
    date_created: "2021-06-01",
    date_updated: "2021-06-01",
    manifest_author: {
        name: "Robert L. Read",
        affiliation: "Public Invention (https://www.pubinv.org/)",
        email: "read.robert@gmail.com"
    },
// manifest-language: en-US
// contact:
//   name: Robert L. Read
//   affiliation: Public Invention (https://www.pubinv.org/)
//   email: read.robert@gmail.com
// contributors:
//   - name: Lauria Clarke
//     affiliation: Public Invention
//   - name: Geoff Mulligan
//     affiliation: Public Invention
//   - name: Ben Coombs
//     affiliation: Public Invention
// version: v0.3T and V0.4T
// development-stage: product
// documentation-home: https://github.com/PubInv/ventmon-ventilator-inline-test-monitor
// archive-download: https://github.com/PubInv/ventmon-ventilator-inline-test-monitor/releases/tag/v0.3.1T
// schematics:
//   - path: https://github.com/PubInv/ventmon-ventilator-inline-test-monitor/blob/master/design/pcb/ventmon_T0.4/ventmon_t0.42.sch
//     title: T0.4 PCB schmatics (look for complete Eagle files)
// bom: https://github.com/PubInv/ventmon-ventilator-inline-test-monitor/blob/master/design/pcb/ventmon_T0.4/VentMon%20T0.4%20BOM.csv
// making-instructions:
//   - path: https://www.sciencedirect.com/science/article/pii/S2468067221000249
//     title: "VentMon: An open source inline ventilator tester and monitor"
//   - path: https://github.com/PubInv/ventmon-ventilator-inline-test-monitor
//     title: Repo for the VentMon
// manufacturing-files:
//   - path: https://github.com/PubInv/ventmon-ventilator-inline-test-monitor/tree/master/design/3dparts
//     title: 3d printed files can be found here
// operating-instructions:
//   - path: https://github.com/PubInv/vent-display
//     title: VentDisplay explanations, including useful video
// software:
//   - path: https://github.com/PubInv/vent-display
//     title: VentDisplay
//   - path: https://github.com/PubInv/PIRDS-pubinv-respiration-data-standard
//     title: Public Invention Respiration Data Standard
//   - path: https://github.com/PubInv/PIRDS-logger
//     title: PIRDS logger
//   - path: https://github.com/PubInv/PIRDS-docker-local
//     title: PIRDS docker instance
// health-safety-notice: This is not intended to be used on live patients.
// standards-used:
//   - standard-title: https://github.com/PubInv/PIRDS-pubinv-respiration-data-standard
//                                  publisher: Public Invention
                                };

    OKWS[0] = { name: "first OKW" };

async function harrysS3Approach() {
    const s3Client = new S3Client({
        region: "us-east-1",
        // https://github.com/aws/aws-sdk-js-v3/issues/2321#issuecomment-916336230
        signer: { sign: (request) => Promise.resolve(request) }
    })
    const bucketName = "github-helpfulengineering-library"

    try {
        const paginator = paginateListObjectsV2(
            { client: s3Client },
            { Bucket: bucketName }
        );

        for await (const page of paginator) {
            const objects = page.Contents ?? [];
            for (const object of objects) {
                console.log(object.Key);
                // const response = await s3Client.send(new GetObjectCommand({ Bucket: bucketName, Key: object.Key }));
                // const body = await response.Body?.transformToString();
                // const qq = YAML.parse(body ?? "");
            }
        }


    } finally {
        s3Client.destroy();
    }
}

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

function init() {
    registerOKH(OKHS[0]);
    harrysS3Approach();
//    robTriesToUseHarrysClientSideS3();
 //   listAlbums();
}

function fetchFromS3ViaURL() {
        // Initialize the Amazon Cognito credentials provider
    // AWS.config.region = 'YOUR_REGION'; // e.g., us-east-1

    // This worked...
    var url = `https://s3.amazonaws.com/${albumBucketName}`;
    fetch(url
//           ,
//           {
//               method: "GET", // *GET, POST, PUT, DELETE, etc.
//               mode: "no-cors", // no-cors, *cors, same-origin
//     // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//     // credentials: "same-origin", // include, *same-origin, omit
//               headers: {
// //                  "Content-Type": "application/json",
//                   "Accept": "application/json"
//               }}
         )
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
      console.log(data); // Do something with the content of the file

      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "application/xml");
      console.log(doc);

      try {
      const json =  xml2json(doc);
          console.log(json);
          objects = JSON.parse(json);
          console.log(objects);
          debugger;
      } catch(error) {
          console.log("xml2json failed");
          console.log(error);
      };
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}
$(init());
