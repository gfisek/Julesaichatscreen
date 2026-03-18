/**
 * css.js — Shadow DOM stylesheet bridge
 * Gerçek CSS kaynağı: ./shadow.css
 * esbuild --loader:.css=text ile string olarak import edilir.
 */

import SHADOW_CSS from './shadow.css';

export { SHADOW_CSS };
