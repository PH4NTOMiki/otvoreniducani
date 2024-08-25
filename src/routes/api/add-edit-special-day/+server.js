import { json, error } from '@sveltejs/kit';
import { db } from '$lib/db-server';

export async function POST({ request, locals }) {
  try {
    /** @type {App.Store["store_days"][0]} */
    const storeDay = await request.json();
    if(!locals.user.stores_owned.includes(storeDay.store_id) && locals.user.role !== 'admin') error(401, 'Unauthorized');
    
    if (storeDay.id) {
        // @ts-ignore
        if (storeDay.delete) {
            const { error: deleteError } = await db
            .from('store_days')
            .delete()
            .eq('id', storeDay.id);
            if (deleteError) throw deleteError;
            return json({ success: true, message: 'Posebni dan uspješno izbrisan' });
        } else {
            const { error: updateError } = await db
            .from('store_days')
            .update({
                date: storeDay.date,
                start: storeDay.start,
                end: storeDay.end
            })
            .eq('id', storeDay.id);
            if (updateError) throw updateError;
            return json({ success: true, message: 'Posebni dan uspješno izmijenjen' });
        }
      } else {
        /** @type {{data: App.Store["store_days"][0]}} */
        // @ts-ignore
        const { data, error: insertError } = await db
          .from('store_days')
          .insert({
            store_id: storeDay.store_id,
            date: storeDay.date,
            start: storeDay.start,
            end: storeDay.end
          })
          .select()
          .single();
          
          if (insertError) throw insertError;
          return json({ success: true, message: 'Posebni dan uspješno dodan', data });
      }
  } catch (error) {
    console.error('Error updating special store day:', error);
    return json({ success: false, message: 'Dogodila se greška' }, { status: 500 });
  }
}