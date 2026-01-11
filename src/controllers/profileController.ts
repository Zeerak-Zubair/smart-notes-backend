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

export async function getProfileById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    console.log('[getProfileById] Request received:', { id });

    console.log('[getProfileById] Fetching profile from database:', id);
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', id)
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
    const { name, email, avatar_url, user_id }: CreateProfileDTO = req.body;
    console.log('[createProfile] Request received:', { name, email, hasAvatar: !!avatar_url, user_id });

    if (!name || !email) {
      console.log('[createProfile] Validation failed:', { name: !!name, email: !!email });
      res.status(400).json({ error: 'name and email are required' });
      return;
    }

    const insertData: any = {
      name,
      email,
      updated_at: new Date().toISOString()
    };

    if (avatar_url !== undefined) insertData.avatar_url = avatar_url;
    if (user_id !== undefined) insertData.user_id = user_id;

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

    console.log('[createProfile] Profile created successfully:', { id: data.id });
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
    const { id } = req.params;
    console.log(id);
    console.log(req.body);
    const { name, user_id } = req.body;
    const image = req.file;
    console.log('[updateProfile] Request received:', { id, name, user_id, hasImage: !!image });

    let avatarUrl = '';

    // Upload image if provided
    if (image) {
      try {
        console.log('[updateProfile] Uploading avatar image:', { profileId: id, userId: user_id });
        const { publicUrl } = await uploadImage({
          file: image,
          bucket: 'smart_notes',
          userId: user_id || id
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

    console.log('[updateProfile] Updating profile in database:', { id, updateFields: Object.keys(updateData) });
    const { data, error } = await supabase
      .from('profile')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[updateProfile] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[updateProfile] Profile updated successfully:', { id });
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
    const { id } = req.params;
    console.log('[deleteProfile] Request received:', { id });

    console.log('[deleteProfile] Deleting profile from database:', id);
    const { error } = await supabase
      .from('profile')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[deleteProfile] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[deleteProfile] Profile deleted successfully:', { id });
    res.status(200).json({
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('[deleteProfile] Unexpected error:', error);
    next(error);
  }
}
