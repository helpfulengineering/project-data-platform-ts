// httpFunctions.ts throws at import time if these are missing (it expects the
// Azure Functions host to supply them via local.settings.json). Unit tests
// import the module directly (outside the func host), so provide dummy
// values here purely to satisfy the startup guard — no network calls in the
// functions under test actually use them.
process.env.Azure_Storage_ServiceName ||= "https://example.blob.core.windows.net";
process.env.Azure_Storage_OKH_ContainerName ||= "okh";
process.env.Azure_Storage_OKW_ContainerName ||= "okw";
