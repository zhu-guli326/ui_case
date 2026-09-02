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
    const loadStyle = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.append(link);
    };

    const loadScript = (src) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.head.append(script);
    };

    loadStyle("./src/features/home/specular-button.css");
    loadScript("./src/features/home/specular-button.js");
  }
})(window, document);
