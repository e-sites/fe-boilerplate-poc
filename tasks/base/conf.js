export default {
  js: {
    entries: ['app.js'],
    vendor: [
      './assets/js/polyfills/core-js',
      'svgxuse',
      '@e-sites/vestigo',
      'scriptjs',
      'conditioner-core',
    ],
  },
  paths: {
    tasks: '/tasks',
    source: './assets',
    dist: './build',
    folders: {
      css: '/css',
      js: '/js',
      images: '/images',
      svg: '/svg',
      mjml: '/path-to-mail',
    },
  },
  revisionFiles: true,
  mjml: {
    enabled: false,
    extension: '.twig',
  },
};
