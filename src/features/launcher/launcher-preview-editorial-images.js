(() => {
  const IMAGES = {
    hero: 'https://media.architecturaldigest.com/photos/651d89da49aa578d430618d4/16%3A9/w_1600%2Ch_900%2Cc_limit/Herrington-23231-01-036.jpg',
    design: 'https://stormfashion.dk/cdn/shop/files/ARK09_currentissue1_1600x.jpg?v=1684336929',
    people: 'https://www.offscreenmag.com/content/4-blog/20170119-indie-magonomics/homeoffice.jpg',
    objects: 'https://monos.com/cdn/shop/products/UVC_bottle_PDP_render_1_4480x.jpg?v=1678608487'
  };

  const style = document.createElement('style');
  style.textContent = `
    #previewDevice[data-template="editorial"] .pt-editorial-hero{position:relative;overflow:hidden;background-image:linear-gradient(180deg,rgba(10,18,13,.12) 0%,rgba(10,25,17,.78) 100%),url('${IMAGES.hero}');background-size:cover;background-position:center;color:#fff}
    #previewDevice[data-template="editorial"] .pt-editorial-hero>*{position:relative;z-index:1;text-shadow:0 1px 10px rgba(0,0,0,.16)}
    #previewDevice[data-template="editorial"] .pt-story-img{background-size:cover!important;background-position:center!important;position:relative}
    #previewDevice[data-template="editorial"] .pt-story-img:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.08))}
    #previewDevice[data-template="editorial"] .pt-story:nth-child(1) .pt-story-img{background-image:url('${IMAGES.design}')!important}
    #previewDevice[data-template="editorial"] .pt-story:nth-child(2) .pt-story-img{background-image:url('${IMAGES.people}')!important}
    #previewDevice[data-template="editorial"] .pt-story:nth-child(3) .pt-story-img{background-image:url('${IMAGES.objects}')!important}
    .preview-device[data-size="mobile"][data-template="editorial"] .pt-story-img{min-height:108px;background-position:center}
    .preview-device[data-size="mobile"][data-template="editorial"] .pt-editorial-hero{min-height:285px;background-position:center}
  `;
  document.head.append(style);
})();