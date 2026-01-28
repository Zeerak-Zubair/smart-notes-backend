import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { uploadImage, createProfile, createProfilePicture } from '../helpers/storage';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const image = req.file;
    console.log('[signup] Request received:', { name, email, hasImage: !!image });

    if (!name || !email || !password) {
      console.log('[signup] Validation failed:', { name: !!name, email: !!email, password: !!password });
      res.status(400).json({ error: 'Name, email and password are required' });
      return;
    }

    // Sign up the user in Supabase Auth
    console.log('[signup] Creating user in Supabase Auth:', { email });
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      console.error('[signup] Supabase Auth error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    if (!data.user) {
      console.error('[signup] User creation failed: no user returned');
      res.status(400).json({ error: 'User creation failed' });
      return;
    }

    console.log('[signup] User created in Auth:', { userId: data.user.id });
    let profilePicId: string | undefined = undefined;

    // Upload image if provided
    if (image) {
      try {
        console.log('[signup] Uploading avatar image:', { userId: data.user.id });
        const { publicUrl } = await uploadImage({
          file: image,
          bucket: 'smart_notes',
          userId: data.user.id
        });
        
        console.log('[signup] Avatar image uploaded, creating profile picture record');
        const { data: picData, error: picError } = await createProfilePicture({
            image_url: publicUrl
        });

        if (picError) {
             console.error('[signup] Failed to create profile picture record:', picError);
        } else {
            const pic = picData as { id: string };
            console.log('[signup] Profile picture record created:', { id: pic.id });
            profilePicId = pic.id;
        }

        console.log('[signup] Avatar processing completed');
      } catch (uploadError) {
        console.error('[signup] Image upload failed:', uploadError);
        // Continue without avatar if upload fails
      }
    }

    // Create user profile
    console.log('[signup] Creating user profile:', { userId: data.user.id });
    const { error: profileError } = await createProfile({
      name,
      profile_pic_id: profilePicId,
      email,
      user_id: data.user.id
    });

    if (profileError) {
      console.error('[signup] Profile creation failed:', profileError);
      res.status(400).json({ error: 'Profile creation failed' });
      return;
    }

    console.log('[signup] User signup completed successfully:', { userId: data.user.id });
    res.status(201).json({
      message: 'User created successfully',
      success: true,
      access_token: data.session?.access_token || '',
      token_type: 'bearer',
      expires_in: data.session?.expires_in || 0,
      expires_at: data.session?.expires_at || 0,
      refresh_token: data.session?.refresh_token || ''
    });
  } catch (error) {
    console.error('[signup] Unexpected error:', error);
    next(error);
  }
}

export async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    console.log('[signin] Request received:', { email });

    if (!email || !password) {
      console.log('[signin] Validation failed:', { email: !!email, password: !!password });
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    console.log('[signin] Authenticating user:', { email });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('[signin] Authentication failed:', { email, error: error.message });
      res.status(401).json({ error: error.message });
      return;
    }

    console.log('[signin] User signed in successfully:', { userId: data.user?.id });
    res.status(200).json({
      message: 'Signed in successfully',
      success: true,
      access_token: data.session?.access_token || '',
      token_type: 'bearer',
      expires_in: data.session?.expires_in || 0,
      expires_at: data.session?.expires_at || 0,
      refresh_token: data.session?.refresh_token || '',
    });
  } catch (error) {
    console.error('[signin] Unexpected error:', error);
    next(error);
  }
}

export async function signout(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('[signout] Request received');

    console.log('[signout] Signing out user');
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[signout] Signout error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[signout] User signed out successfully');
    res.status(200).json({
      message: 'Signed out successfully'
    });
  } catch (error) {
    console.error('[signout] Unexpected error:', error);
    next(error);
  }
}

export async function getSession(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('[getSession] Request received');

    console.log('[getSession] Fetching session');
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('[getSession] Error fetching session:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[getSession] Session fetched:', { hasSession: !!data.session });
    res.status(200).json({
      session: data.session
    });
  } catch (error) {
    console.error('[getSession] Unexpected error:', error);
    next(error);
  }
}
