import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { downloadBlobToJson, listFilesInContainer } from '../lib/azure-storage.js';
export async function getOKH(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';


    try {
        if (
          !process.env?.Azure_Storage_ServiceName ||
          !process.env?.Azure_Storage_ContainerName
        ) {
          return {
            status: 405,
            jsonBody: 'Missing required app configuration'
          };
        }
    
        const containerName = process.env?.Azure_Storage_ContainerName;
        context.log(`containerName: ${containerName}`);``
    
        if (!containerName) {
          return {
            status: 405,
            jsonBody: 'Missing required container name'
          };
        }
        
        const { error, errorMessage, data } = await listFilesInContainer(
          process.env?.Azure_Storage_ServiceName as string,
          containerName
        );
        context.log(errorMessage);
        context.log(JSON.stringify(data));
        
        const okh = await downloadBlobToJson(
            process.env?.Azure_Storage_ServiceName as string,
            containerName,
            `okh-${name}.json`
        )
        
        if (!error) {
          return {
            jsonBody: { okh }
          };
        } else {
          return {
            status: 500,
            jsonBody: errorMessage
          };
        }
      } catch (error) {
        return {
          status: 500,
          jsonBody: error
        };
      }
    
    return { body: `Hello, ${name}!` };
};

app.http('getOKH', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getOKH
});
