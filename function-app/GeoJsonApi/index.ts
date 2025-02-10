import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { geoData } from "../data/geoData";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    try {
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            },
            body: geoData
        };
    } catch (error) {
        context.log.error('Error processing request:', error);
        context.res = {
            status: 500,
            body: "Internal server error"
        };
    }
};

export default httpTrigger;