import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { CreateNotebookDTO, UpdateNotebookDTO } from '../types';

export async function getAllNotebooks(req: Request, res: Response, next: NextFunction) {
  try {
    const { folder_id } = req.query;

    let query = supabase.from('notebooks').select('*');

    if (folder_id) {
      query = query.eq('folder_id', folder_id);
    }

    const { data, error } = await query.order('order_index', { ascending: true });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      notebooks: data,
      count: data.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getNotebookById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Notebook not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function createNotebook(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, color, folder_id, order_index }: CreateNotebookDTO = req.body;

    if (!title || !description || !color || !folder_id || order_index === undefined) {
      res.status(400).json({ error: 'title, description, color, folder_id, and order_index are required' });
      return;
    }

    const { data, error } = await supabase
      .from('notebooks')
      .insert([{
        title,
        description,
        color,
        folder_id,
        order_index,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json({
      message: 'Notebook created successfully',
      notebook: data
    });
  } catch (error) {
    next(error);
  }
}

export async function updateNotebook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title, description, color, folder_id, order_index }: UpdateNotebookDTO = req.body;

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (folder_id !== undefined) updateData.folder_id = folder_id;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('notebooks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Notebook updated successfully',
      notebook: data
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteNotebook(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('notebooks')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Notebook deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
