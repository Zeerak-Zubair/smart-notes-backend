import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { CreateProfileDTO, UpdateProfileDTO } from '../types';

export async function getAllProfiles(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      profiles: data,
      count: data.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfileById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function getProfileByUserId(req: Request, res: Response, next: NextFunction) {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function createProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, avatar_url, user_id }: CreateProfileDTO = req.body;

    if (!name || !email) {
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

    const { data, error } = await supabase
      .from('profile')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json({
      message: 'Profile created successfully',
      profile: data
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, avatar_url, email }: UpdateProfileDTO = req.body;

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (email !== undefined) updateData.email = email;

    const { data, error } = await supabase
      .from('profile')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: data
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('profile')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
