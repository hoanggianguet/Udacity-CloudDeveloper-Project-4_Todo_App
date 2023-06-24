// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'jzx87tim8h'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-kaxprhf6cf8j6dwl.us.auth0.com',            // Auth0 domain
  clientId: '5AFDgoTS87H5R4oGV63I24cbPkYnr6xZ',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
