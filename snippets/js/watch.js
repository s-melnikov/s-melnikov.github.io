const watch = (object, onChange) => {
 return new Proxy(object, {
   get(target, property, receiver) {
     try {
       return new Proxy(target[property], handler)
     } catch (err) {
       return Reflect.get(target, property, receiver)
     }
   },
   defineProperty(target, property, descriptor) {
     onChange()
     return Reflect.defineProperty(target, property, descriptor)
   },
   deleteProperty(target, property) {
     onChange()
     return Reflect.deleteProperty(target, property)
   }
 })
}
