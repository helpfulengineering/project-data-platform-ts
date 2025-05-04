import { app } from '@azure/functions';

// Import all functions to ensure they are registered properly
// Note: In TypeScript you should use .ts extension in imports, but
// the compiled JavaScript will use .js extensions
import './functions/httpFunctions';

app.setup({
    enableHttpStream: true,
});
