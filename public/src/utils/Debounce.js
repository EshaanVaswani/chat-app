export const debounce = (fn, timeout = 500) => {
   let timer;
   return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
         fn.apply(this, args);
      }, timeout);
   };
};
