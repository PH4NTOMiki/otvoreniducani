import { json, error } from '@sveltejs/kit';
import { db } from '$lib/db-server';
import bcrypt from 'bcryptjs';

export async function POST({ request, locals }) {
  try {
    /** @type {App.Locals["user"]} */
    const user = await request.json();
    if(locals.user.role !== 'admin') error(401, 'Unauthorized');

    const _user = {
      username: user.username,
      email: user.email,
      role: user.role,
      stores_owned: user.stores_owned,
    };

    // Password validation
    if (user.password) {
      if (user.password.length < 8) {
        return json({ success: false, message: 'Lozinka mora biti najmanje 8 znakova dugačka' }, { status: 400 });
      }
      // @ts-ignore
      _user.password = await bcrypt.hash(user.password, 10);
    }
    
    if (user.id) {
        // @ts-ignore
        if (user.delete) {
            const { error: deleteError } = await db
            .from('store_users')
            .delete()
            .eq('id', user.id);
            if (deleteError) throw deleteError;
            return json({ success: true, message: 'Korisnik uspješno izbrisan' });
        } else {
            const { error: updateError } = await db
            .from('store_users')
            .update(_user)
            .eq('id', user.id);
            if (updateError) throw updateError;
            return json({ success: true, message: 'Korisnik uspješno ažuriran' });
        }
    } else {
        // Ensure password is provided for new users
        if (!user.password) {
            return json({ success: false, message: 'Lozinka je obavezna za nove korisnike' }, { status: 400 });
        }

        /** @type {{data: App.Locals["user"]}} */
        // @ts-ignore
        const { data, error: insertError } = await db
          .from('store_users')
          .insert(_user)
          .select()
          .single();
          
        if (insertError) throw insertError;
        // @ts-ignore
        delete data.password;
        return json({ success: true, message: 'Korisnik uspješno kreiran', data });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    return json({ success: false, message: 'Dogodila se greška' }, { status: 500 });
  }
}