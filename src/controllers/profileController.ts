import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseService } from '../config/supabase';
import { UpdateProfileDTO } from '../types';
import { deleteFile, deleteProfilePicture, uploadImage } from '../helpers/storage';



export async function updateProfilePicture(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const image = req.file;

    console.log('[updateProfilePicture] Request received:', { userId, hasImage: !!image });

    if (!image) {
      res.status(400).json({ error: 'Image file is required' });
      return;
    }

    // 1. Upload new image
    console.log('[updateProfilePicture] Uploading image:', { userId });
    let publicUrl = '';
    try {
        const result = await uploadImage({
            file: image,
            bucket: 'smart_notes',
            userId: userId
        });
        publicUrl = result.publicUrl;
    } catch (uploadError) {
        console.error('[updateProfilePicture] Image upload failed:', uploadError);
        res.status(500).json({ error: 'Failed to upload image' });
        return;
    }

    // 2. Create profile_picture record
    // We import createProfilePicture from helpers/storage
    const { createProfilePicture } = await import('../helpers/storage');
    console.log('[updateProfilePicture] Creating profile picture record');
    
    const { data: picData, error: picError } = await createProfilePicture({
        image_url: publicUrl
    });

    if (picError) {
        console.error('[updateProfilePicture] Failed to create profile picture record:', picError);
        res.status(500).json({ error: 'Failed to save profile picture record' });
        return;
    }

    const pic = picData as { id: string };
    const profilePicId = pic.id;

    // 3. Get the OLD profile picture ID before we update the profile
    console.log('[updateProfilePicture] Fetching users current profile to check for existing picture');
    const { data: currentProfile } = await supabase
        .from('profile')
        .select('profile_pic_id')
        .eq('user_id', userId)
        .single();

    const oldProfilePicId = currentProfile?.profile_pic_id;

    // 4. Update user profile to link to new picture
    console.log('[updateProfilePicture] Updating user profile with new picture ID:', { userId, profilePicId });
    const { data, error } = await supabase
      .from('profile')
      .update({ 
          profile_pic_id: profilePicId,
          updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select('user_id, name, email, profile_pic_id, created_at, updated_at')
      .single();

    if (error) {
      console.error('[updateProfilePicture] Database error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    // 5. Delete the old profile picture and file if it existed
    if (oldProfilePicId) {
        console.log('[updateProfilePicture] Deleting old profile picture:', { oldProfilePicId });
        
        // Fetch the old picture record to get the URL
        const { data: oldPicData } = await supabaseService
            .from('profile_pictures')
            .select('image_url')
            .eq('id', oldProfilePicId)
            .single();

        console.log('[updateProfilePicture] Old profile picture data:', oldPicData); 
           
        if (oldPicData?.image_url) {
            // Extract file path from URL
            // URL format: .../storage/v1/object/public/smart_notes/filename.ext
            const fileUrl = oldPicData.image_url;
            const bucketName = 'smart_notes';
            
            // Allow for different URL structures (signed vs public)
            // Simple extraction: last part of URL is usually the filename in this setup
            // or we can split by bucket name
            const parts = fileUrl.split(`${bucketName}/`);
            if (parts.length > 1) {
                const filePath = parts[1];
                console.log('[updateProfilePicture] Deleting old file from storage:', { filePath });
                
                // Fire and forget - don't block response on cleanup
                Promise.all([
                    deleteFile({ bucket: bucketName, path: filePath }).catch(e => console.error('Failed to delete old file:', e)),
                    deleteProfilePicture(oldProfilePicId).catch(e => console.error('Failed to delete old db record:', e))
                ]).then(() => console.log('[updateProfilePicture] Cleanup complete'));
            }
        }
    }

    console.log('[updateProfilePicture] Profile updated successfully:', { userId });
    res.status(200).json({
      message: 'Profile picture updated successfully',
      profile: data
    });

  } catch (error) {
    console.error('[updateProfilePicture] Unexpected error:', error);
    next(error);
  }
}
