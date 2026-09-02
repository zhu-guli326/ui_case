(function (window, document) {
  const projectId = "y9sadfgw8z";

  window.clarity =
    window.clarity ||
    function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

  if (!document.querySelector(`script[data-clarity="${projectId}"]`)) {
    const clarity = document.createElement("script");
    clarity.async = true;
    clarity.src = `https://www.clarity.ms/tag/${projectId}`;
    clarity.dataset.clarity = projectId;
    document.head.append(clarity);
  }

  if (document.body?.classList.contains("project-home") || /(?:^|\/)learn\.html$/.test(location.pathname)) {
    const ripple = document.createElement("script");
    ripple.src = "./src/features/home/ripple-distortion.js";
    ripple.defer = true;
    document.head.append(ripple);
  }
})(window, document);
