export function getCookie(name: string) {
const v = document.cookie.split(';').map(c => c.trim());
for (const c of v) if (c.startsWith(name + '=')) return decodeURIComponent(c.split('=')[1]);
return '';
}