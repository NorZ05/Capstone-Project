const pool = require('../db');
(async function(){
  try{
    const sampleIds = [1001,1002,1275];
    const r = await pool.query('SELECT product_id, qty_on_hand, location FROM inventory WHERE product_id = ANY($1)', [sampleIds]);
    console.log('sample:', JSON.stringify(r.rows));
    const cnt = await pool.query('SELECT COUNT(*) as c, SUM(qty_on_hand) as total_qty, SUM(CASE WHEN qty_on_hand>0 THEN 1 ELSE 0 END) as with_stock FROM inventory');
    console.log('summary:', JSON.stringify(cnt.rows));
  }catch(e){
    console.error('error:', e && e.message);
  }finally{
    pool.end();
  }
})();
