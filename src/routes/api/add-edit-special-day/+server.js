import { json, error } from '@sveltejs/kit';
import { db } from '$lib/db-server';

export async function POST({ request, locals }) {
  try {
    const storeDay = await request.json();
    if(!locals.user.stores_owned.includes(parseInt(storeDay.store_id)) && locals.user.role !== 'admin') error(401, 'Unauthorized');
    
    if (storeDay.id) {
        if (storeDay.delete) {
            const { error: deleteError } = await db
            .from('store_days')
            .delete()
            .eq('id', storeDay.id);
            if (deleteError) throw deleteError;
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
        }
      } else {
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
          return json({ success: true, message: 'Store hours added successfully', data });
      }

    return json({ success: true, message: 'Store hours updated successfully' });
  } catch (error) {
    console.error('Error updating store hours:', error);
    return json({ success: false, message: 'Failed to update store hours' }, { status: 500 });
  }
}