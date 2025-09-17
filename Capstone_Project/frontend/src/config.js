// small config: use REACT_APP_API_URL to override the dev proxy when needed
// If REACT_APP_API_URL is set (e.g. http://127.0.0.1:5000) normalize it to include the /api prefix
const raw = process.env.REACT_APP_API_URL || '';
let API_BASE;
if (raw) {
	const trimmed = raw.replace(/\/+$/, ''); // remove trailing slash(es)
	API_BASE = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
} else {
	API_BASE = '/api';
}

export default { API_BASE };
