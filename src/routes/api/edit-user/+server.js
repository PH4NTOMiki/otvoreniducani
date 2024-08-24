import { json, error } from '@sveltejs/kit';
import { db } from '$lib/db-server';
import bcrypt from 'bcryptjs';

export async function POST({ request, locals }) {
  try {
    const user = await request.json();
    if(locals.user.role !== 'admin') error(401, 'Unauthorized');

    const _user = {
      username: user.username,
      email: user.email,
      role: user.role,
      stores_owned: user.stores_owned,
    };
    // @ts-ignore
    if (user.password) {_user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10))}
    
    if (user.id) {
        if (user.delete) {
            const { error: deleteError } = await db
            .from('store_users')
            .delete()
            .eq('id', user.id);
            if (deleteError) throw deleteError;
        } else {
            const { error: updateError } = await db
            .from('store_users')
            .update(_user)
            .eq('id', user.id);
            if (updateError) throw updateError;
        }
      } else {
        const { data, error: insertError } = await db
          .from('store_users')
          .insert(_user)
          .select()
          .single();
          
          if (insertError) throw insertError;
          delete data.password;
          return json({ success: true, message: 'User added successfully', data });
      }

    return json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user hours:', error);
    return json({ success: false, message: 'Failed to update user' }, { status: 500 });
  }
}