import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { CreateProfileDTO, UpdateProfileDTO } from '../types';
import { uploadImage } from '../helpers/storage';

export async function getAllProfiles(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('[getAllProfiles] Request received');

    console.log('[getAllProfiles] Fetching profiles from database');
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getAllProfiles] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[getAllProfiles] Successfully fetched profiles:', { count: data.length });
    res.status(200).json({
      profiles: data,
      count: data.length
    });
  } catch (error) {
    console.error('[getAllProfiles] Unexpected error:', error);
    next(error);
  }
}

export async function getCurrentProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    console.log('[getCurrentProfile] Request received for user:', userId);

    console.log('[getCurrentProfile] Fetching profile from database:', userId);
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('[getCurrentProfile] Profile not found or database error:', { userId, error });
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    console.log('[getCurrentProfile] Successfully fetched profile:', { userId });
    res.status(200).json(data);
  } catch (error) {
    console.error('[getCurrentProfile] Unexpected error:', error);
    next(error);
  }
}

export async function getProfileById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params; // This id is arguably user_id based on schema
    console.log('[getProfileById] Request received:', { id });

    console.log('[getProfileById] Fetching profile from database:', id);
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) {
      console.error('[getProfileById] Profile not found or database error:', { id, error });
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    console.log('[getProfileById] Successfully fetched profile:', { id });
    res.status(200).json(data);
  } catch (error) {
    console.error('[getProfileById] Unexpected error:', error);
    next(error);
  }
}

export async function getProfileByUserId(req: Request, res: Response, next: NextFunction) {
  try {
    const { user_id } = req.params;
    console.log('[getProfileByUserId] Request received:', { user_id });

    console.log('[getProfileByUserId] Fetching profile from database by user_id:', user_id);
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error) {
      console.error('[getProfileByUserId] Profile not found or database error:', { user_id, error });
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    console.log('[getProfileByUserId] Successfully fetched profile:', { user_id });
    res.status(200).json(data);
  } catch (error) {
    console.error('[getProfileByUserId] Unexpected error:', error);
    next(error);
  }
}

export async function createProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, avatar_url }: CreateProfileDTO = req.body;
    const userId = (req as any).userId;

    console.log('[createProfile] Request received:', { name, email, hasAvatar: !!avatar_url, userId });

    if (!name || !email || !userId) {
      console.log('[createProfile] Validation failed:', { name: !!name, email: !!email, userId: !!userId });
      res.status(400).json({ error: 'name and email are required' });
      return;
    }

    const insertData: any = {
      name,
      email,
      user_id: userId,
      updated_at: new Date().toISOString()
    };

    if (avatar_url !== undefined) insertData.avatar_url = avatar_url;

    console.log('[createProfile] Creating profile in database');
    const { data, error } = await supabase
      .from('profile')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('[createProfile] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[createProfile] Profile created successfully:', { user_id: userId });
    res.status(201).json({
      message: 'Profile created successfully',
      profile: data
    });
  } catch (error) {
    console.error('[createProfile] Unexpected error:', error);
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const { name } = req.body;
    const image = req.file;

    console.log('[updateProfile] Request received:', { userId, name, hasImage: !!image });

    let avatarUrl = '';

    // Upload image if provided
    if (image) {
      try {
        console.log('[updateProfile] Uploading avatar image:', { userId });
        const { publicUrl } = await uploadImage({
          file: image,
          bucket: 'smart_notes',
          userId: userId
        });
        avatarUrl = publicUrl;
        console.log('[updateProfile] Avatar uploaded successfully:', { avatarUrl });
      } catch (uploadError) {
        console.error('[updateProfile] Image upload failed:', uploadError);
        res.status(500).json({ error: 'Failed to upload image' });
        return;
      }
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (avatarUrl) updateData.avatar_url = avatarUrl;

    console.log('[updateProfile] Updating profile in database:', { userId, updateFields: Object.keys(updateData) });
    const { data, error } = await supabase
      .from('profile')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('[updateProfile] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[updateProfile] Profile updated successfully:', { userId });
    res.status(200).json({
      message: 'Profile updated successfully',
      profile: data
    });
  } catch (error) {
    console.error('[updateProfile] Unexpected error:', error);
    next(error);
  }
}

export async function deleteProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    console.log('[deleteProfile] Request received:', { userId });

    console.log('[deleteProfile] Deleting profile from database:', { userId });
    const { error } = await supabase
      .from('profile')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('[deleteProfile] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[deleteProfile] Profile deleted successfully:', { userId });
    res.status(200).json({
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('[deleteProfile] Unexpected error:', error);
    next(error);
  }
}
