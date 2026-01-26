import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { CreateNotebookDTO, UpdateNotebookDTO } from '../types';

export async function getAllNotebooks(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    console.log('[getAllNotebooks] Request received for user:', userId);

    console.log('[getAllNotebooks] Fetching notebooks from database');
    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('[getAllNotebooks] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[getAllNotebooks] Successfully fetched notebooks:', { count: data.length });
    res.status(200).json({
      notebooks: data,
      count: data.length
    });
  } catch (error) {
    console.error('[getAllNotebooks] Unexpected error:', error);
    next(error);
  }
}

export async function getAllNotebooksCount(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    console.log('[getAllNotebooksCount] Request received for user:', userId);

    let query = supabase
    .from('notebooks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

    console.log('[getAllNotebooksCount] Fetching notebooks count from database');
    const { count, error } = await query;

    if (error) {
      console.error('[getAllNotebooksCount] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[getAllNotebooksCount] Successfully fetched notebooks count:', count);
    res.status(200).json({
      count: count
    });
  } catch (error) {
    console.error('[getAllNotebooksCount] Unexpected error:', error);
    next(error);
  }
}


export async function getNotebookById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    console.log('[getNotebookById] Request received:', { id });

    console.log('[getNotebookById] Fetching notebook from database:', id);
    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId) // Ensure user owns the notebook
      .single();

    if (error) {
      console.error('[getNotebookById] Notebook not found or database error:', { id, error });
      res.status(404).json({ error: 'Notebook not found' });
      return;
    }

    console.log('[getNotebookById] Successfully fetched notebook:', { id });
    res.status(200).json(data);
  } catch (error) {
    console.error('[getNotebookById] Unexpected error:', error);
    next(error);
  }
}

export async function createNotebook(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, color, order_index }: CreateNotebookDTO = req.body;
    const userId = (req as any).userId;
    console.log('[createNotebook] Request received:', { title, description, color, order_index, userId });

    if (!title || !description || !color || order_index === undefined) {
      console.log('[createNotebook] Validation failed:', {
        title: !!title,
        description: !!description,
        color: !!color,
        order_index: order_index !== undefined
      });
      res.status(400).json({ error: 'title, description, color, and order_index are required' });
      return;
    }

    console.log('[createNotebook] Creating notebook in database');
    const { data, error } = await supabase
      .from('notebooks')
      .insert([{
        title,
        description,
        color,
        user_id: userId,
        order_index,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('[createNotebook] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[createNotebook] Notebook created successfully:', { id: data.id });
    res.status(201).json({
      message: 'Notebook created successfully',
      notebook: data
    });
  } catch (error) {
    console.error('[createNotebook] Unexpected error:', error);
    next(error);
  }
}

export async function updateNotebook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title, description, color}: UpdateNotebookDTO = req.body;
    const userId = (req as any).userId;
    console.log('[updateNotebook] Request received:', { id, title, description, color });

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;

    console.log('[updateNotebook] Updating notebook in database:', { id, updateFields: Object.keys(updateData) });
    const { data, error } = await supabase
      .from('notebooks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId) // Ensure ownership
      .select()
      .single();

    if (error) {
      console.error('[updateNotebook] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[updateNotebook] Notebook updated successfully:', { id });
    res.status(200).json({
      message: 'Notebook updated successfully',
      notebook: data
    });
  } catch (error) {
    console.error('[updateNotebook] Unexpected error:', error);
    next(error);
  }
}

export async function deleteNotebook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    console.log('[deleteNotebook] Request received:', { id });

    console.log('[deleteNotebook] Deleting notebook from database:', id);
    const { error } = await supabase
      .from('notebooks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Ensure ownership

    if (error) {
      console.error('[deleteNotebook] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[deleteNotebook] Notebook deleted successfully:', { id });
    res.status(200).json({
      message: 'Notebook deleted successfully'
    });
  } catch (error) {
    console.error('[deleteNotebook] Unexpected error:', error);
    next(error);
  }
}
