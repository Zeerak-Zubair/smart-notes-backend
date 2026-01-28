import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { CreateNoteDTO, UpdateNoteDTO } from '../types';

export async function getAllNotes(req: Request, res: Response, next: NextFunction) {
  try {
    const { notebook_id } = req.body;
    const userId = (req as any).userId;
    console.log('[getAllNotes] Request received:', { notebook_id, userId });

    if (!notebook_id) {
        res.status(400).json({ error: 'notebook_id is required' });
        return;
    }

    console.log('[getAllNotes] Filtering by notebook_id:', notebook_id);
    let query = supabase.from('notes').select('*').eq('notebook_id', notebook_id);

    console.log('[getAllNotes] Fetching notes from database');
    const { data, error } = await query.order('order_index', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('[getAllNotes] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[getAllNotes] Successfully fetched notes:', { count: data.length });
    res.status(200).json({
      notes: data,
      count: data.length
    });
  } catch (error) {
    console.error('[getAllNotes] Unexpected error:', error);
    next(error);
  }
}

export async function getNoteById(req: Request, res: Response, next: NextFunction) {
  try {
    const { note_id } = req.body;
    const userId = (req as any).userId;
    console.log('[getNoteById] Request received:', { note_id, userId });

    if (!note_id) {
        res.status(400).json({ error: 'note_id is required' });
        return;
    }

    console.log('[getNoteById] Fetching note from database:', note_id);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', note_id)
      .single();

    if (error) {
      console.error('[getNoteById] Note not found or database error:', { note_id, error });
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    console.log('[getNoteById] Successfully fetched note:', { note_id });
    res.status(200).json(data);
  } catch (error) {
    console.error('[getNoteById] Unexpected error:', error);
    next(error);
  }
}

export async function createNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { notebook_id, content, order_index }: CreateNoteDTO = req.body;
    const userId = (req as any).userId;
    console.log('[createNote] Request received:', { notebook_id, content: content?.substring(0, 50), order_index, userId });

    if (!notebook_id) {
      console.log('[createNote] Validation failed: notebook_id is missing');
      res.status(400).json({ error: 'notebook_id is required' });
      return;
    }

    const insertData: any = {
      notebook_id,
      updated_at: new Date().toISOString()
    };

    if (content !== undefined) insertData.content = content;
    if (order_index !== undefined) insertData.order_index = order_index;

    console.log('[createNote] Creating note in database:', { notebook_id, hasContent: !!content, order_index });
    const { data, error } = await supabase
      .from('notes')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('[createNote] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[createNote] Note created successfully:', { id: data.id });
    res.status(201).json({
      message: 'Note created successfully',
      note: data
    });
  } catch (error) {
    console.error('[createNote] Unexpected error:', error);
    next(error);
  }
}

export async function updateNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { note_id, content, notebook_id, order_index }: UpdateNoteDTO & { note_id: string } = req.body;
    const userId = (req as any).userId;
    console.log('[updateNote] Request received:', { note_id, content: content?.substring(0, 50), notebook_id, order_index, userId });

    if (!note_id) {
        res.status(400).json({ error: 'note_id is required' });
        return;
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (content !== undefined) updateData.content = content;
    if (notebook_id !== undefined) updateData.notebook_id = notebook_id;
    if (order_index !== undefined) updateData.order_index = order_index;

    console.log('[updateNote] Updating note in database:', { note_id, updateFields: Object.keys(updateData) });
    const { data, error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', note_id)
      .select()
      .single();

    if (error) {
      console.error('[updateNote] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[updateNote] Note updated successfully:', { note_id });
    res.status(200).json({
      message: 'Note updated successfully',
      note: data
    });
  } catch (error) {
    console.error('[updateNote] Unexpected error:', error);
    next(error);
  }
}

export async function deleteNote(req: Request, res: Response, next: NextFunction) {
  try {
    const { note_id } = req.body;
    const userId = (req as any).userId;
    console.log('[deleteNote] Request received:', { note_id, userId });

    if (!note_id) {
        res.status(400).json({ error: 'note_id is required' });
        return;
    }

    console.log('[deleteNote] Deleting note from database:', note_id);
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', note_id);

    if (error) {
      console.error('[deleteNote] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    console.log('[deleteNote] Note deleted successfully:', { note_id });
    res.status(200).json({
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('[deleteNote] Unexpected error:', error);
    next(error);
  }
}
