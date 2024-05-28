import {
    S3Client,
    paginateListObjectsV2,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import * as YAML from 'yaml'

interface Atom {
    identifier: string;
    description?: string;
    link?: string;
}

function parseAtom(atom: any): Atom | undefined {
    if (typeof atom !== "object") { return; }

    const identifier = atom["identifier"] as string | undefined;
    const description = atom["description"] as string | undefined;
    const link = atom["link"] as string | undefined;

    return identifier ? { identifier, description, link } : undefined;
}

function isValid<T>(value: T | null | undefined): value is T { return !!value; }

function parseAtomArray(atom: any) {
    return Array.isArray(atom)
        ? atom.map(parseAtom).filter(isValid)
        : [];
}

interface OkwParty {
    title: string;
    supplies?: Atom[];
    tools?: Atom[];
    inventory?: Atom[];
}

function parseOKW(body: string): OkwParty {
    const yaml = YAML.parse(body);
    const title = yaml["title"] as string | undefined;
    if (typeof title !== "string") { throw new Error("Title must be a string"); }
    const supplies = parseAtomArray(yaml["supply-atoms"]);
    const tools = parseAtomArray(yaml["tool-list-atoms"])
    const inventory = parseAtomArray(yaml["inventory-atoms"])
    return { title, supplies, tools, inventory };
}

interface OkhDesign {
    title: string;
    product: Atom;
    bom?: Atom[];
    tools?: Atom[];
    bomOutput?: Atom[];
}

function parseOKH(body: string): OkhDesign | undefined {
    const yml = YAML.parse(body);
    const title = yml["title"];
    if (typeof title !== "string") { return; }

    const product = parseAtom(yml["product-atom"])
    if (!product) { return; }
    const bom = parseAtomArray(yml["bom-atoms"])
    const tools = parseAtomArray(yml["tool-list-atoms"])
    const bomOutput = parseAtomArray(yml["bom-output-atoms"])
    return { title, product, bom, tools, bomOutput };
}

async function main() {
    const s3Client = new S3Client({
        region: "us-east-1",
        // https://github.com/aws/aws-sdk-js-v3/issues/2321#issuecomment-916336230
        signer: { sign: (request) => Promise.resolve(request) }
    })
    const bucketName = "github-helpfulengineering-library"

    async function* listFiles(prefix: string) {
        const paginator = paginateListObjectsV2(
            { client: s3Client },
            { Bucket: bucketName, Delimiter: "/", Prefix: prefix }
        );

        for await (const page of paginator) {
            for (const object of page.Contents ?? []) {
                console.log(object.Key);
                yield object;
            }
        }
    }

    async function getObject(key: string) {
        const response = await s3Client.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
        return await response.Body?.transformToString();
    }

    try {
        const okws = new Array<OkwParty>();
        for await (const file of listFiles("beta/okw/")) {
            if (!file.Key) { continue; }
            const body = await getObject(file.Key);
            const okw = body ? parseOKW(body) : undefined;
            if (okw) { okws.push(okw); }
        }

        const okhs = new Array<OkhDesign>();
        for await (const file of listFiles("beta/okh/")) {
            if (!file.Key) { continue; }
            const body = await getObject(file.Key);
            const okh = body ? parseOKH(body) : undefined;
            if (okh) { okhs.push(okh); }
        }

        console.log(JSON.stringify(okws, undefined, 4));
        console.log(JSON.stringify(okhs, undefined, 4));
    } finally {
        s3Client.destroy();
    }
}

main().catch(console.error);