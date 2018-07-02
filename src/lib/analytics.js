import GoogleAnalytics from 'react-ga';

GoogleAnalytics.initialize('UA-112536261-1', {
    debug: (process.env.NODE_ENV !== 'production'),
    titleCase: true,
    sampleRate: (process.env.NODE_ENV === 'production') ? 100 : 0,
    forceSSL: true
});

export default GoogleAnalytics;
