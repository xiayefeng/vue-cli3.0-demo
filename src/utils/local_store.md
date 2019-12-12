## Method illustrate
* localStorage and sessionStorage method
```js
 utils.store.getSession(key)  @param {string}, get sessionStorage(key)
 utils.store.setSession(key, val)  @param {key: string, val: any} set sessionStorage(key, val)
 utils.store.getLocal(key)  @param {string}, get localStorage(key)
 utils.store.setLocal(key, val)  @param {key: string, val: any}  set localStorage(key, val)
 utils.store.removeSession(key) @param {string}, delete sessionStorage(key)
 utils.store.removeLocal(key)  @param {string},  delete localStorage(key)
 utils.store.removeAllSession()  delete all sessionStorage
 utils.store.removeAllLocal()  delete all localStorage
 utils.store.removeAllStorage() delete all localStorage and sessionStorage
```