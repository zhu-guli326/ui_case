(function (window, document) {
  const projectId = "y9sadfgw8z";

  window.clarity =
    window.clarity ||
    function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

  if (document.querySelector(`script[data-clarity="${projectId}"]`)) return;

  const clarity = document.createElement("script");
  clarity.async = true;
  clarity.src = `https://www.clarity.ms/tag/${projectId}`;
  clarity.dataset.clarity = projectId;
  document.head.append(clarity);
})(window, document);
