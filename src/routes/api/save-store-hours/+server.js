import { json, error } from '@sveltejs/kit';
import { db } from '$lib/db-server';

export async function POST({ request, locals }) {
  try {
    /** @type {App.Store} */
    const storeData = await request.json();
    if(!locals.user.stores_owned.includes(storeData.id) && locals.user.role !== 'admin') error(401, 'Unauthorized');
    
    const { error: _err } = await db
      .from('stores')
      .update({
        default_start: storeData.default_start,
        default_end: storeData.default_end,
        //store_days: storeData.store_days
      })
      .eq('id', storeData.id);

    if (_err) throw _err;

    return json({ success: true, message: 'Radni sati uspješno ažurirani' });
  } catch (error) {
    console.error('Error updating store hours:', error);
    return json({ success: false, message: 'Dogodila se greška' }, { status: 500 });
  }
}