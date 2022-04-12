/**
 * @author BNC Team
 * This worker accesses the name space named REWRITE_MAP mapped to KV store and tries to get a value assocaited to the Key (Which is request.url)
 */




 addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  //Import URLSearchParams to parse the query string
  console.log("The folders request url is " + request.url)
  const urlPath = new URL(request.url)
  const params = new URLSearchParams(urlPath.search)
  console.log("The params Query String is" + params.toString())
  console.log("The urlPath Object is " + urlPath);
  const value = await FOLDER_REWRITE_MAP.get(urlPath.pathname)
  const redirectValue = await FOLDER_REDIRECT_MAP.get(urlPath.pathname)
  const qaValue = await QA_FOLDER_REWRITE_MAP.get(urlPath.pathname)
  const qaRedirectValue = await QA_FOLDER_REDIRECT_MAP.get(urlPath.pathname)
  const isQAHost = urlPath.host.startsWith("qa")
  console.log("The envelopes URL to be redirected for the provided URL:"+urlPath.pathname+" is :"+value)  
  urlVal=""
  isRewrite = false
  isRedirectPath = false
  if(isQAHost) {
    if(qaRedirectValue) {
      urlVal = "https://"+urlPath.host+redirectValue
      if(params.toString() != "") {
        urlVal = urlVal + "?" + params.toString()
      }
      console.log("(QA Redirect) The Query String to be apppended to urlVal "+params.toString())    
      console.log("The QA Redirect URL to be redirected is "+urlVal)
      isRedirectPath = true
      
    }
    else if(qaValue) {
      urlVal = "https://"+urlPath.host+value
      if(params.toString() != "") {
        urlVal = urlVal + "?" + params.toString()
      }
      console.log("(QA Rewrite) The Query String to be apppended to urlVal "+params.toString())        
      console.log("The QA Rewrite URL to be redirected is "+urlVal)
      isRewrite = true
    }  else {    
      urlVal = request.url
      console.log("The Query String to be apppended to urlVal "+params.toString())
      console.log("Since no path matched sending to URL Val"+urlVal)    
    }
  }
  else {
    if(redirectValue) {
      urlVal = "https://"+urlPath.host+redirectValue
      if(params.toString() != "") {
        urlVal = urlVal + "?" + params.toString()
      }
      console.log("(Redirect) The Query String to be apppended to urlVal "+params.toString())    
      console.log("The Redirect URL to be redirected is "+urlVal)
      isRedirectPath = true
      
    }
    else if(value) {
      urlVal = "https://"+urlPath.host+value
      if(params.toString() != "") {
        urlVal = urlVal + "?" + params.toString()
      }
      console.log("(Rewrite) The Query String to be apppended to urlVal "+params.toString())        
      console.log("The Rewrite URL to be redirected is "+urlVal)
      isRewrite = true
    }  else {    
      urlVal = request.url
      console.log("The Query String to be apppended to urlVal "+params.toString())
      console.log("Since no path matched sending to URL Val"+urlVal)    
    }
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