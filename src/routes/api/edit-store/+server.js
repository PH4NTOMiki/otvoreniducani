import { json, error } from '@sveltejs/kit';
import { db } from '$lib/db-server';

export async function POST({ request, locals }) {
  try {
    /** @type {App.Store} */
    const store = await request.json();
    if(locals.user.role !== 'admin') error(401, 'Unauthorized');
    
    if (store.id) {
        // @ts-ignore
        if (store.delete) {
            const { error: deleteError } = await db
            .from('stores')
            .delete()
            .eq('id', store.id);
            if (deleteError) throw deleteError;
            return json({ success: true, message: 'Dućan uspješno izbrisan' });
        } else {
            const { error: updateError } = await db
            .from('stores')
            .update({
              title: store.title,
              address: store.address,
              town: store.town,
              coordinate_x: store.coordinate_x,
              coordinate_y: store.coordinate_y,
            })
            .eq('id', store.id);
            if (updateError) throw updateError;
            return json({ success: true, message: 'Dućan uspješno ažuriran' });
        }
      } else {
        /** @type {{data: App.Store}} */
        // @ts-ignore
        const { data, error: insertError } = await db
          .from('stores')
          .insert({
            title: store.title,
            address: store.address,
            town: store.town,
            coordinate_x: store.coordinate_x,
            coordinate_y: store.coordinate_y,
            default_start: [...Array(6).fill('08:00:00'), null],
            default_end: [...Array(6).fill('16:00:00'), null],
          })
          .select()
          .single();
          
          if (insertError) throw insertError;
          return json({ success: true, message: 'Dućan uspješno kreiran', data });
      }
  } catch (error) {
    console.error('Error updating store:', error);
    return json({ success: false, message: 'Dogodila se greška' }, { status: 500 });
  }
}