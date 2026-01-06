import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { uploadImage, createProfile } from '../helpers/storage';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const image = req.file;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required' });
      return;
    }

    // Sign up the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (!data.user) {
      res.status(400).json({ error: 'User creation failed' });
      return;
    }

    let avatarUrl = '';

    // Upload image if provided
    if (image) {
      try {
        const { publicUrl } = await uploadImage({
          file: image,
          bucket: 'smart_notes',
          userId: data.user.id
        });
        avatarUrl = publicUrl;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue without avatar if upload fails
      }
    }

    // Create user profile
    const { error: profileError } = await createProfile({
      name,
      avatar_url: avatarUrl,
      email,
      user_id: data.user.id
    });

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      res.status(400).json({ error: 'Profile creation failed' });
      return;
    }

    res.status(201).json({
      message: 'User created successfully',
      user: data.user,
      session: data.session
    });
  } catch (error) {
    next(error);
  }
}

export async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      res.status(401).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Signed in successfully',
      user: data.user,
      session: data.session
    });
  } catch (error) {
    next(error);
  }
}

export async function signout(req: Request, res: Response, next: NextFunction) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Signed out successfully'
    });
  } catch (error) {
    next(error);
  }
}

export async function getSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      session: data.session
    });
  } catch (error) {
    next(error);
  }
}
