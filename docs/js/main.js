
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


function robTriesToUseHarrysClientSideS3() {
    // Initialize the Amazon Cognito credentials provider
    // AWS.config.region = 'YOUR_REGION'; // e.g., us-east-1

    // This worked...
    var url = `https://s3.amazonaws.com/${albumBucketName}`;
    fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    console.log(data); // Do something with the content of the file
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(
        {
            IdentityPoolId: 'THIS IS A FAKE ID',
            IdentityId: 'THIS IS A FAKE ID',
        }
    );

//     // Create S3 service object
//     var s3 = new AWS.S3();

//     const params = {
//         Bucket: albumBucketName,
//         Key: 'alpha/okh/okh-Character-Generator.yml'
//     };

//     s3.getObject(params, (err, data) => {
//   if (err) {
//     console.error('Error retrieving object:', err);
//   } else {
//     console.log('Object data:', data.Body.toString());
//   }
// });

//     // Call S3 to list the buckets
//     s3.listObjects({ Bucket: albumBucketName }, function (err, data) {
//         if (err) {
//             console.log('Error', err);
//         } else {
//             console.log('Success', data);
//         }
//     });


    // region = "us-east-2";
    // releaseName = "debug-proxy";
    // //    regexVersion = new RegExp(`^${this.releaseName}\/(?<Version>.*)\/$`);

    // // Note: Using an identity signer function is a workaround for an AWS SDk issue
    // // https://github.com/aws/aws-sdk-js-v3/issues/2321#issuecomment-916336230
    // var s3 = S3Client({
    //   region: region,
    //   signer: { sign: (request) => Promise.resolve(request) }
    // });
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

function init() {
    registerOKH(OKHS[0]);
    robTriesToUseHarrysClientSideS3();
 //   listAlbums();
}
$(init());
