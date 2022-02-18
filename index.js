/**
 * @author BNC Team
 * This worker accesses the name space named REWRITE_MAP mapped to KV store and tries to get a value assocaited to the Key (Which is request.url)
 */




 addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  
  console.log("The folders request url is " + request)
  const urlPath = new URL(request.url)
  const value = await FOLDER_REWRITE_MAP.get(urlPath.pathname)
  const redirectValue = await FOLDER_REDIRECT_MAP.get(urlPath.pathname)
  console.log("The URL to be redirected for the provided URL:"+urlPath.pathname+" is :"+value)  
  urlVal=""
  isRewrite = false
  isRedirectPath = false
  if(redirectValue) {
    urlVal = "https://"+urlPath.host+redirectValue
    isRedirectPath = true
  }
  else if(value) {
    urlVal = "https://"+urlPath.host+value
    isRewrite = true
  }  else {
    urlVal = request.url
  }
  if(isRewrite) {
    return fetch(new Request(urlVal, {
      body: request.body,
      headers: request.headers,
      method: request.method,
      redirect: request.redirect
    }))
  }
  if(isRedirectPath){
    return Response.redirect(urlVal, 301)
  }
  //If its neither rewrite or redirect just send to existing URL
  return fetch(new Request(urlVal, {
    body: request.body,
    headers: request.headers,
    method: request.method,
    redirect: request.redirect
  }))  

}