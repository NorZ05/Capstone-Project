const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
(async ()=>{
  const form = new FormData();
  form.append('name','API uploaded');
  form.append('price','99.99');
  form.append('category','Test');
  form.append('image', fs.createReadStream('tmp_img.jpg'));
  const res = await fetch('http://127.0.0.1:5000/api/products',{ method: 'POST', body: form, headers: form.getHeaders() });
  const t = await res.text();
  console.log('status', res.status);
  console.log(t);
})();
