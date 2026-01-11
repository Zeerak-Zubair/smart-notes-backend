import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { CreateFolderDTO, UpdateFolderDTO } from '../types';

export async function getAllFolders(req: Request, res: Response, next: NextFunction) {
  try {
    const { user_id } = req.query;

    console.log('[getAllFolders] Request received:', { user_id });
    console.log(typeof user_id);

    if (!user_id) {
      console.log('[getAllFolders] Validation failed: user_id is missing');
      res.status(400).json({ error: 'user_id is required' });
      return;
    }

    console.log('[getAllFolders] Fetching folders from database for user:', user_id);
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user_id);

    if (error) {
      console.error('[getAllFolders] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[getAllFolders] Successfully fetched folders:', { count: data.length });
    res.status(200).json({
      folders: data
    });
  } catch (error) {
    console.error('[getAllFolders] Unexpected error:', error);
    next(error);
  }
}

export async function getFolderById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    console.log('[getFolderById] Request received:', { id });

    console.log('[getFolderById] Fetching folder from database:', id);
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[getFolderById] Folder not found or database error:', { id, error });
      res.status(404).json({ error: 'Folder not found' });
      return;
    }

    console.log('[getFolderById] Successfully fetched folder:', { id });
    res.status(200).json(data);
  } catch (error) {
    console.error('[getFolderById] Unexpected error:', error);
    next(error);
  }
}

export async function createFolder(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, user_id }: CreateFolderDTO = req.body;
    console.log('[createFolder] Request received:', { title, user_id });

    if (!title || !user_id) {
      console.log('[createFolder] Validation failed:', { title: !!title, user_id: !!user_id });
      res.status(400).json({ error: 'title and user_id are required' });
      return;
    }

    console.log('[createFolder] Creating folder in database:', { title, user_id });
    const { data, error } = await supabase
      .from('folders')
      .insert([{ title, user_id }])
      .select()
      .single();

    if (error) {
      console.error('[createFolder] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[createFolder] Folder created successfully:', { id: data.id });
    res.status(201).json({
      message: 'Folder created successfully',
      success: true,
      folder: data
    });
  } catch (error) {
    console.error('[createFolder] Unexpected error:', error);
    next(error);
  }
}

export async function updateFolder(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title }: UpdateFolderDTO = req.body;
    console.log('[updateFolder] Request received:', { id, title });

    if (!title) {
      console.log('[updateFolder] Validation failed: title is missing');
      res.status(400).json({ error: 'title is required' });
      return;
    }

    console.log('[updateFolder] Updating folder in database:', { id, title });
    const { data, error } = await supabase
      .from('folders')
      .update({ title })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[updateFolder] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[updateFolder] Folder updated successfully:', { id });
    res.status(200).json({
      message: 'Folder updated successfully',
      folder: data
    });
  } catch (error) {
    console.error('[updateFolder] Unexpected error:', error);
    next(error);
  }
}

export async function deleteFolder(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    console.log('[deleteFolder] Request received:', { id });

    console.log('[deleteFolder] Deleting folder from database:', id);
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[deleteFolder] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[deleteFolder] Folder deleted successfully:', { id });
    res.status(200).json({
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    console.error('[deleteFolder] Unexpected error:', error);
    next(error);
  }
}
