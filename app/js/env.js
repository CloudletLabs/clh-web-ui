(function (window) {
    window.__env = window.__env || {};

    // API url
    window.__env.apiVersion = 'current';
    window.__env.apiUrl = 'https://clh-web-api-dev.herokuapp.com/api/' + window.__env.apiVersion;

    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.enableDebug = true;
}(this));
