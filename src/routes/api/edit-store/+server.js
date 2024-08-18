import { json, error } from '@sveltejs/kit';
import { db } from '$lib/db-server';

export async function POST({ request, locals }) {
  try {
    const store = await request.json();
    if(locals.user.role !== 'admin') error(401, 'Unauthorized');
    
    if (store.id) {
        if (store.delete) {
            const { error: deleteError } = await db
            .from('stores')
            .delete()
            .eq('id', store.id);
            if (deleteError) throw deleteError;
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
        }
      } else {
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
          return json({ success: true, message: 'Store hours added successfully', data });
      }

    return json({ success: true, message: 'Store hours updated successfully' });
  } catch (error) {
    console.error('Error updating store hours:', error);
    return json({ success: false, message: 'Failed to update store hours' }, { status: 500 });
  }
}