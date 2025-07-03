import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Images, Edit, Trash2, Plus, Video, Image as ImageIcon, Eye, Calendar } from 'lucide-react';
import { useGallery } from '@/hooks/useGallery';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/lib/supabase';

type GalleryItem = Database['public']['Tables']['gallery_items']['Row'];
type GalleryItemInsert = Database['public']['Tables']['gallery_items']['Insert'];

const GalleryManager = () => {
  const { t } = useTranslation();
  const { galleryItems, loading, fetchAllGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } = useGallery();
  
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  const [formData, setFormData] = useState<GalleryItemInsert>({
    type: 'photo',
    url: '',
    thumbnail_url: '',
    title_tr: '',
    title_az: '',
    title_en: '',
    description_tr: '',
    description_az: '',
    description_en: '',
    alt_text_tr: '',
    alt_text_az: '',
    alt_text_en: '',
    categories_tr: '',
    categories_az: '',
    categories_en: '',
    published: false,
    display_order: 0
  });

  useEffect(() => {
    fetchAllGalleryItems();
  }, []);

  const resetForm = () => {
    setFormData({
      type: 'photo',
      url: '',
      thumbnail_url: '',
      title_tr: '',
      title_az: '',
      title_en: '',
      description_tr: '',
      description_az: '',
      description_en: '',
      alt_text_tr: '',
      alt_text_az: '',
      alt_text_en: '',
      categories_tr: '',
      categories_az: '',
      categories_en: '',
      published: false,
      display_order: 0
    });
  };

  const handleInputChange = (field: keyof GalleryItemInsert, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateItem = async () => {
    try {
      if (!formData.title_en || !formData.title_tr || !formData.title_az || !formData.url) {
        toast({
          title: t('gallery.error'),
          description: t('gallery.fillRequiredFields'),
          variant: "destructive",
        });
        return;
      }

      await createGalleryItem(formData);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      if (!formData.title_en || !formData.title_tr || !formData.title_az || !formData.url) {
        toast({
          title: t('gallery.error'),
          description: t('gallery.fillRequiredFields'),
          variant: "destructive",
        });
        return;
      }

      await updateGalleryItem(editingItem.id, formData);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteGalleryItem(id);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      url: item.url,
      thumbnail_url: item.thumbnail_url || '',
      title_tr: item.title_tr,
      title_az: item.title_az,
      title_en: item.title_en,
      description_tr: item.description_tr || '',
      description_az: item.description_az || '',
      description_en: item.description_en || '',
      alt_text_tr: item.alt_text_tr || '',
      alt_text_az: item.alt_text_az || '',
      alt_text_en: item.alt_text_en || '',
      categories_tr: item.categories_tr || '',
      categories_az: item.categories_az || '',
      categories_en: item.categories_en || '',
      published: item.published,
      display_order: item.display_order || 0
    });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openPreviewDialog = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsPreviewDialogOpen(true);
  };

  const getStatusColor = (published: boolean) => {
    return published 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getTypeIcon = (type: string) => {
    return type === 'video' ? Video : ImageIcon;
  };

  const sortedItems = [...galleryItems].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Images className="h-5 w-5 mr-2" />
            {t('gallery.management')} ({galleryItems.length})
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            {t('gallery.addNewItem')}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p>{t('gallery.loading')}</p>
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">{t('gallery.noItems')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {/* Media Preview */}
                    <div className="relative h-48 bg-gray-100">
                      {item.type === 'photo' ? (
                        <img
                          src={item.thumbnail_url || item.url}
                          alt={item.alt_text_en || item.title_en}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Video className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge className={getStatusColor(item.published)}>
                          {item.published ? t('gallery.published') : t('gallery.draft')}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {t(`gallery.${item.type}`)}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-medium mb-2 line-clamp-2">{item.title_en}</h3>
                      {item.description_en && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description_en}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{t('gallery.order')}: {item.display_order || 0}</span>
                        <span>
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Categories */}
                      {item.categories_en && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {item.categories_en.split(',').map((category, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {category.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => openPreviewDialog(item)}
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {t('gallery.preview')}
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          {t('gallery.edit')}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('gallery.deleteItem')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('gallery.deleteConfirmation', { title: item.title_en })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('gallery.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteItem(item.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t('gallery.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Item Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('gallery.createNewItem')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">{t('gallery.basic')}</TabsTrigger>
                  <TabsTrigger value="content">{t('gallery.content')}</TabsTrigger>
                  <TabsTrigger value="seo">{t('gallery.seo')}</TabsTrigger>
                  <TabsTrigger value="settings">{t('gallery.settings')}</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-1">{t('gallery.type')}</Label>
                      <Select value={formData.type} onValueChange={(value: 'photo' | 'video') => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="photo">{t('gallery.photo')}</SelectItem>
                          <SelectItem value="video">{t('gallery.video')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1">{t('gallery.displayOrder')}</Label>
                      <Input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.url')} *</Label>
                    <Input
                      value={formData.url}
                      onChange={(e) => handleInputChange('url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.thumbnailUrl')}</Label>
                    <Input
                      value={formData.thumbnail_url}
                      onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.titleTurkish')} *</Label>
                    <Input
                      value={formData.title_tr}
                      onChange={(e) => handleInputChange('title_tr', e.target.value)}
                      placeholder={t('gallery.titleTurkishPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.titleAzerbaijani')} *</Label>
                    <Input
                      value={formData.title_az}
                      onChange={(e) => handleInputChange('title_az', e.target.value)}
                      placeholder={t('gallery.titleAzerbaijaniPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.titleEnglish')} *</Label>
                    <Input
                      value={formData.title_en}
                      onChange={(e) => handleInputChange('title_en', e.target.value)}
                      placeholder={t('gallery.titleEnglishPlaceholder')}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.descriptionTurkish')}</Label>
                    <Textarea
                      value={formData.description_tr}
                      onChange={(e) => handleInputChange('description_tr', e.target.value)}
                      rows={3}
                      placeholder={t('gallery.descriptionTurkishPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.descriptionAzerbaijani')}</Label>
                    <Textarea
                      value={formData.description_az}
                      onChange={(e) => handleInputChange('description_az', e.target.value)}
                      rows={3}
                      placeholder={t('gallery.descriptionAzerbaijaniPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.descriptionEnglish')}</Label>
                    <Textarea
                      value={formData.description_en}
                      onChange={(e) => handleInputChange('description_en', e.target.value)}
                      rows={3}
                      placeholder={t('gallery.descriptionEnglishPlaceholder')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.altTextTurkish')}</Label>
                    <Input
                      value={formData.alt_text_tr}
                      onChange={(e) => handleInputChange('alt_text_tr', e.target.value)}
                      placeholder={t('gallery.altTextTurkishPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.altTextAzerbaijani')}</Label>
                    <Input
                      value={formData.alt_text_az}
                      onChange={(e) => handleInputChange('alt_text_az', e.target.value)}
                      placeholder={t('gallery.altTextAzerbaijaniPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.altTextEnglish')}</Label>
                    <Input
                      value={formData.alt_text_en}
                      onChange={(e) => handleInputChange('alt_text_en', e.target.value)}
                      placeholder={t('gallery.altTextEnglishPlaceholder')}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.categoriesTurkish')}</Label>
                    <Input
                      value={formData.categories_tr}
                      onChange={(e) => handleInputChange('categories_tr', e.target.value)}
                      placeholder={t('gallery.categoriesPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.categoriesAzerbaijani')}</Label>
                    <Input
                      value={formData.categories_az}
                      onChange={(e) => handleInputChange('categories_az', e.target.value)}
                      placeholder={t('gallery.categoriesPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.categoriesEnglish')}</Label>
                    <Input
                      value={formData.categories_en}
                      onChange={(e) => handleInputChange('categories_en', e.target.value)}
                      placeholder={t('gallery.categoriesPlaceholder')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => handleInputChange('published', checked)}
                    />
                    <Label htmlFor="published">{t('gallery.publishImmediately')}</Label>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t('gallery.cancel')}
                </Button>
                <Button onClick={handleCreateItem}>
                  {t('gallery.createItem')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('gallery.editItem')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">{t('gallery.basic')}</TabsTrigger>
                  <TabsTrigger value="content">{t('gallery.content')}</TabsTrigger>
                  <TabsTrigger value="seo">{t('gallery.seo')}</TabsTrigger>
                  <TabsTrigger value="settings">{t('gallery.settings')}</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-1">{t('gallery.type')}</Label>
                      <Select value={formData.type} onValueChange={(value: 'photo' | 'video') => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="photo">{t('gallery.photo')}</SelectItem>
                          <SelectItem value="video">{t('gallery.video')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1">{t('gallery.displayOrder')}</Label>
                      <Input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.url')} *</Label>
                    <Input
                      value={formData.url}
                      onChange={(e) => handleInputChange('url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.thumbnailUrl')}</Label>
                    <Input
                      value={formData.thumbnail_url}
                      onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.titleTurkish')} *</Label>
                    <Input
                      value={formData.title_tr}
                      onChange={(e) => handleInputChange('title_tr', e.target.value)}
                      placeholder={t('gallery.titleTurkishPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.titleAzerbaijani')} *</Label>
                    <Input
                      value={formData.title_az}
                      onChange={(e) => handleInputChange('title_az', e.target.value)}
                      placeholder={t('gallery.titleAzerbaijaniPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.titleEnglish')} *</Label>
                    <Input
                      value={formData.title_en}
                      onChange={(e) => handleInputChange('title_en', e.target.value)}
                      placeholder={t('gallery.titleEnglishPlaceholder')}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.descriptionTurkish')}</Label>
                    <Textarea
                      value={formData.description_tr}
                      onChange={(e) => handleInputChange('description_tr', e.target.value)}
                      rows={3}
                      placeholder={t('gallery.descriptionTurkishPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.descriptionAzerbaijani')}</Label>
                    <Textarea
                      value={formData.description_az}
                      onChange={(e) => handleInputChange('description_az', e.target.value)}
                      rows={3}
                      placeholder={t('gallery.descriptionAzerbaijaniPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.descriptionEnglish')}</Label>
                    <Textarea
                      value={formData.description_en}
                      onChange={(e) => handleInputChange('description_en', e.target.value)}
                      rows={3}
                      placeholder={t('gallery.descriptionEnglishPlaceholder')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.altTextTurkish')}</Label>
                    <Input
                      value={formData.alt_text_tr}
                      onChange={(e) => handleInputChange('alt_text_tr', e.target.value)}
                      placeholder={t('gallery.altTextTurkishPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.altTextAzerbaijani')}</Label>
                    <Input
                      value={formData.alt_text_az}
                      onChange={(e) => handleInputChange('alt_text_az', e.target.value)}
                      placeholder={t('gallery.altTextAzerbaijaniPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.altTextEnglish')}</Label>
                    <Input
                      value={formData.alt_text_en}
                      onChange={(e) => handleInputChange('alt_text_en', e.target.value)}
                      placeholder={t('gallery.altTextEnglishPlaceholder')}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.categoriesTurkish')}</Label>
                    <Input
                      value={formData.categories_tr}
                      onChange={(e) => handleInputChange('categories_tr', e.target.value)}
                      placeholder={t('gallery.categoriesPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.categoriesAzerbaijani')}</Label>
                    <Input
                      value={formData.categories_az}
                      onChange={(e) => handleInputChange('categories_az', e.target.value)}
                      placeholder={t('gallery.categoriesPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">{t('gallery.categoriesEnglish')}</Label>
                    <Input
                      value={formData.categories_en}
                      onChange={(e) => handleInputChange('categories_en', e.target.value)}
                      placeholder={t('gallery.categoriesPlaceholder')}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published-edit"
                      checked={formData.published}
                      onCheckedChange={(checked) => handleInputChange('published', checked)}
                    />
                    <Label htmlFor="published-edit">{t('gallery.published')}</Label>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t('gallery.cancel')}
                </Button>
                <Button onClick={handleUpdateItem}>
                  {t('gallery.updateItem')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{t('gallery.preview')}</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {selectedItem.type === 'photo' ? (
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.alt_text_en || selectedItem.title_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Video className="h-16 w-16 text-gray-400" />
                      <div className="ml-4">
                        <p className="font-medium">{selectedItem.title_en}</p>
                        <p className="text-sm text-gray-600">{t('gallery.videoPreviewNotAvailable')}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{selectedItem.title_en}</h3>
                  {selectedItem.description_en && (
                    <p className="text-gray-700 mb-4">{selectedItem.description_en}</p>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">{t('gallery.type')}:</span> {t(`gallery.${selectedItem.type}`)}
                    </div>
                    <div>
                      <span className="font-medium">{t('gallery.status')}:</span> {selectedItem.published ? t('gallery.published') : t('gallery.draft')}
                    </div>
                    <div>
                      <span className="font-medium">{t('gallery.displayOrder')}:</span> {selectedItem.display_order || 0}
                    </div>
                    <div>
                      <span className="font-medium">{t('gallery.created')}:</span> {new Date(selectedItem.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {selectedItem.categories_en && (
                    <div className="mt-4">
                      <span className="font-medium text-sm">{t('gallery.categories')}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedItem.categories_en.split(',').map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GalleryManager;