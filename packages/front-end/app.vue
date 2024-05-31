<!--
Copyright (C) 2024 by Robert L. Read <read.robert@gmail.com> and James Butler

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

-->
<script setup  lang="ts">
  import { ref } from 'vue';

</script>


  <template>
    <div id="threecontainer"></div>

    <h2>Project Data</h2>

    <p> Welcome. This is a Work In Progress. It is a tool for expressing both needs
      (demand) and capability (supply) when a normal supply chain is disrupted,
      as happened during the COVID-19 pandemic.
    </p>
    <h2> Catalog </h2>
    <p> Choose an OKH: </p>

    <div id="okhlist_diaplay"></div>
    <table id="xxx">
    </table>
    <table id="okh_table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
        </tr>
      </tbody>
    </table>

    <p>
      <button @click="runUnitTests()">Execute Unit Tests</button>
<!--      <button type="button" onclick="runUnitTests()">
          Execute Tests!</button>
          -->
    </p>

    <p> This is a test of our ability to read S3 buckets:
      <div id="viewer"></div>
    </p>

    <h2>Licensing</h2>

    <img src="https://www.gnu.org/graphics/agplv3-with-text-162x68.png"></img>

    <section>
      <p>All of the code on this site is released under the <a href="https://www.gnu.org/licenses/agpl-3.0.html">GNU Affero General Public License Version 2</a>, and I hope you will
        reuse it. The code, including technical documentation, can be found <a href="https://github.com/PubInv/segmented-helixes">in the repo</a>.</p>
      <p>This project is part of <a href="https://helpfulengineering.org/">Helpful Engineering</a>. To assist on this project, contact Robert L. Read &lt; read.robert@gmail.com &gt;</p>
    </section>


  </template>


  <script lang="ts">
    import { paginateListObjectsV2, ListBucketsCommand, S3Client } from  '@aws-sdk/client-s3';
    export default {

        methods: {
            displayForm(){
                const create_new = (<HTMLInputElement>document.getElementById("create_new"));
                const create_device = (<HTMLInputElement>document.getElementById("create_device"));
                const create_container = (<HTMLInputElement>document.getElementById("create_container"));
                if(create_new.checked) {
                    create_device.style.display = "none";
                    create_container.style.display = "inline";

                } else{
                    create_device.style.display = "inline";
                    create_container.style.display = "none";
                }
            },

        }
    };


let OKHS = [];
let OKWS = [];

OKHS[0] = { name: "first OKH" };

let VENTMON_EXAMPLE_WIRED_OKH = {
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
function runUnitTests() {
        alert("no tests yet!");
        harrysS3Approach();
}

    </script>
