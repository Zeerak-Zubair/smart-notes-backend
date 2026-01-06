import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { CreateFolderDTO, UpdateFolderDTO } from '../types';

export async function getAllFolders(req: Request, res: Response, next: NextFunction) {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      res.status(400).json({ error: 'user_id is required' });
      return;
    }

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      folders: data,
      count: data.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getFolderById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Folder not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function createFolder(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, user_id }: CreateFolderDTO = req.body;

    if (!title || !user_id) {
      res.status(400).json({ error: 'title and user_id are required' });
      return;
    }

    const { data, error } = await supabase
      .from('folders')
      .insert([{ title, user_id }])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json({
      message: 'Folder created successfully',
      folder: data
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFolder(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title }: UpdateFolderDTO = req.body;

    if (!title) {
      res.status(400).json({ error: 'title is required' });
      return;
    }

    const { data, error } = await supabase
      .from('folders')
      .update({ title })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Folder updated successfully',
      folder: data
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFolder(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
