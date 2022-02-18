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
  const params = new URLSearchParams(urlPath.search)
  console.log("The(Folders) params Query String is" + params.toString())  
  console.log("The(Folders) urlPath Object is " + urlPath);
  const value = await FOLDER_REWRITE_MAP.get(urlPath.pathname)
  const redirectValue = await FOLDER_REDIRECT_MAP.get(urlPath.pathname)
  console.log("The Folders URL to be redirected for the provided URL:"+urlPath.pathname+" is :"+value)  
  urlVal=""
  isRewrite = false
  isRedirectPath = false
  if(redirectValue) {
    urlVal = "https://"+urlPath.host+redirectValue
    if(params.toString() != "") {
      urlVal = urlVal + "?" + params.toString()
    }
    console.log("(Folders Redirect) The Query String to be apppended to urlVal "+params.toString())        
    isRedirectPath = true
  }
  else if(value) {
    urlVal = "https://"+urlPath.host+value
    if(params.toString() != "") {
      urlVal = urlVal + "?" + params.toString()
    }
    console.log("(Folders Rewrite) The Query String to be apppended to urlVal "+params.toString())            
    isRewrite = true
  }  else {
    urlVal = request.url
    //Append params to urlVal if params is not empty
    if(params.toString() != "") {
      urlVal = urlVal + "?" + params.toString()
    }
    console.log("The Folders Query String to be apppended to urlVal "+params.toString())
    console.log("Since no path matched (Folders) sending to URL Val"+urlVal)    
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