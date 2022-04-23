let timer = null;

export const debounce = (callback, wait) => {
  if (timer) clearTimeout(timer);
  
  timer = setTimeout(function() {
    callback();
  }, wait);
};
