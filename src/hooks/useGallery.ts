import { useState, useEffect } from 'react';
import { galleryApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/lib/supabase';

type GalleryItem = Database['public']['Tables']['gallery_items']['Row'];
type GalleryItemInsert = Database['public']['Tables']['gallery_items']['Insert'];
type GalleryItemUpdate = Database['public']['Tables']['gallery_items']['Update'];

export const useGallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching published gallery items...');
      
      const data = await galleryApi.getAllPublished();
      console.log('Gallery items fetched successfully:', data);
      
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load gallery items';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to load gallery items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching all gallery items (admin)...');
      
      const data = await galleryApi.getAll();
      console.log('All gallery items fetched successfully:', data);
      
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching all gallery items:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load gallery items';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to load gallery items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGalleryItem = async (itemData: GalleryItemInsert) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating gallery item:', itemData);
      
      const newItem = await galleryApi.create(itemData);
      console.log('Gallery item created successfully:', newItem);
      
      // Refresh the list
      await fetchAllGalleryItems();
      
      toast({
        title: "Success",
        description: "Gallery item created successfully.",
      });
      
      return newItem;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create gallery item';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to create gallery item. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateGalleryItem = async (id: string, itemData: GalleryItemUpdate) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating gallery item:', id, itemData);
      
      const updatedItem = await galleryApi.update(id, itemData);
      console.log('Gallery item updated successfully:', updatedItem);
      
      // Refresh the list
      await fetchAllGalleryItems();
      
      toast({
        title: "Success",
        description: "Gallery item updated successfully.",
      });
      
      return updatedItem;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update gallery item';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to update gallery item. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deleting gallery item:', id);
      
      await galleryApi.delete(id);
      console.log('Gallery item deleted successfully');
      
      // Refresh the list
      await fetchAllGalleryItems();
      
      toast({
        title: "Success",
        description: "Gallery item deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete gallery item';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to delete gallery item. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  return {
    galleryItems,
    loading,
    error,
    fetchGalleryItems,
    fetchAllGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
  };
};