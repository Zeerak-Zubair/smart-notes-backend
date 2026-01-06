import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { CreateNoteDTO, UpdateNoteDTO } from '../types';

export async function getAllNotes(req: Request, res: Response, next: NextFunction) {
  try {
    const { notebook_id } = req.query;

    let query = supabase.from('notes').select('*');

    if (notebook_id) {
      query = query.eq('notebook_id', notebook_id);
    }

    const { data, error } = await query.order('order_index', { ascending: true, nullsFirst: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      notes: data,
      count: data.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getNoteById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function createNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { notebook_id, content, order_index }: CreateNoteDTO = req.body;

    if (!notebook_id) {
      res.status(400).json({ error: 'notebook_id is required' });
      return;
    }

    const insertData: any = {
      notebook_id,
      updated_at: new Date().toISOString()
    };

    if (content !== undefined) insertData.content = content;
    if (order_index !== undefined) insertData.order_index = order_index;

    const { data, error } = await supabase
      .from('notes')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(201).json({
      message: 'Note created successfully',
      note: data
    });
  } catch (error) {
    next(error);
  }
}

export async function updateNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { content, notebook_id, order_index }: UpdateNoteDTO = req.body;

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (content !== undefined) updateData.content = content;
    if (notebook_id !== undefined) updateData.notebook_id = notebook_id;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Note updated successfully',
      note: data
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
