/**
 * Resources component manages session-related learning materials and files.
 * Allows mentors to share resources and mentees to mark them as completed.
 * 
 * Features:
 * - Resource upload and linking
 * - File management with Supabase storage
 * - Progress tracking
 * - Completion status updates
 * - Real-time updates
 * 
 * State Management:
 * - Tracks resource list and updates
 * - Manages file upload progress
 * - Handles completion status
 * - Maintains loading and error states
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link as LinkIcon, Paperclip, Trash2, X, Check, CheckCircle } from 'lucide-react';

interface SessionResource {
  id: string;
  title: string;
  url: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  description: string | null;
  created_at: string;
  author_id: string;
  completed: boolean;
  completed_at: string | null;
  completion_comment: string | null;
}

interface ResourcesProps {
  /** ID of the session these resources belong to */
  sessionId: string;
  /** Current authenticated user information */
  user: {
    id: string;
    email: string;
    role: 'mentor' | 'mentee';
    profileId: string;
  } | null;
}

export function Resources({ sessionId, user }: ResourcesProps) {
  // Resource management state
  const [resources, setResources] = useState<SessionResource[]>([]);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceDescription, setNewResourceDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionComment, setCompletionComment] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  /**
   * Fetches session resources on component mount.
   * Updates resource list when changes occur.
   */
  useEffect(() => {
    fetchResources();
  }, [sessionId]);

  /**
   * Fetches all resources for the current session.
   * Handles loading state and error handling.
   */
  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error: resourcesError } = await supabase
        .from('session_resources')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (resourcesError) throw resourcesError;
      setResources(data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles file selection for upload.
   * Clears URL input when file is selected.
   * 
   * @param e - File input change event
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setNewResourceUrl('');
    }
  };

  /**
   * Handles URL input for linking resources.
   * Clears file selection when URL is entered.
   * 
   * @param e - URL input change event
   */
  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewResourceUrl(e.target.value);
    setSelectedFile(null);
  };

  /**
   * Uploads a file to Supabase storage.
   * Tracks upload progress and handles errors.
   * 
   * @param file - File to upload
   * @returns Upload details including URL and metadata
   */
  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${sessionId}/${fileName}`;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const { data, error } = await supabase.storage
        .from('session-resources')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          },
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('session-resources')
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        name: file.name,
        type: file.type,
        size: file.size
      };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Handles resource submission (both files and URLs).
   * Creates resource record and handles file upload if needed.
   * 
   * @param e - Form submission event
   */
  const handleSubmitResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.profileId || !newResourceTitle.trim() || (!newResourceUrl.trim() && !selectedFile)) return;

    try {
      let fileData = null;
      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      }

      const { error: resourceError } = await supabase
        .from('session_resources')
        .insert([{
          session_id: sessionId,
          author_id: user.profileId,
          title: newResourceTitle.trim(),
          url: newResourceUrl.trim() || null,
          file_url: fileData?.url || null,
          file_name: fileData?.name || null,
          file_type: fileData?.type || null,
          file_size: fileData?.size || null,
          description: newResourceDescription.trim() || null
        }]);

      if (resourceError) throw resourceError;
      
      setNewResourceTitle('');
      setNewResourceUrl('');
      setNewResourceDescription('');
      setSelectedFile(null);
      setShowResourceForm(false);
      fetchResources();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  /**
   * Handles resource deletion.
   * Removes both the resource record and associated file if any.
   * 
   * @param resourceId - ID of the resource to delete
   * @param fileUrl - URL of the associated file (if any)
   */
  const handleDeleteResource = async (resourceId: string, fileUrl: string | null) => {
    try {
      if (fileUrl) {
        const filePath = fileUrl.split('/').pop();
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from('session-resources')
            .remove([filePath]);
          
          if (storageError) throw storageError;
        }
      }

      const { error: deleteError } = await supabase
        .from('session_resources')
        .delete()
        .eq('id', resourceId);

      if (deleteError) throw deleteError;

      setResources(resources.filter(r => r.id !== resourceId));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  /**
   * Handles toggling resource completion status.
   * Shows completion modal for adding comments when marking as complete.
   * 
   * @param resourceId - ID of the resource
   * @param completed - Current completion status
   */
  const handleToggleCompletion = async (resourceId: string, completed: boolean) => {
    if (!completed) {
      setSelectedResourceId(resourceId);
      setShowCompletionModal(true);
    } else {
      await updateResourceCompletion(resourceId, false);
    }
  };

  /**
   * Updates resource completion status and adds completion comment.
   * Creates system message for completion tracking.
   * 
   * @param resourceId - ID of the resource
   * @param completed - New completion status
   * @param comment - Optional completion comment
   */
  const updateResourceCompletion = async (resourceId: string, completed: boolean, comment?: string) => {
    try {
      const resource = resources.find(r => r.id === resourceId);
      if (!resource) return;

      const { error: updateError } = await supabase
        .from('session_resources')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          completion_comment: comment || null
        })
        .eq('id', resourceId);

      if (updateError) throw updateError;

      // Add a system message about the completion
      if (completed) {
        const { error: messageError } = await supabase
          .from('messages')
          .insert([{
            session_id: sessionId,
            sender_id: user?.profileId,
            content: `__SYSTEM_RESOURCE_COMPLETED__${resource.title}${comment ? `\n${comment}` : ''}`
          }]);

        if (messageError) throw messageError;
      }

      setResources(resources.map(resource =>
        resource.id === resourceId
          ? {
              ...resource,
              completed,
              completed_at: completed ? new Date().toISOString() : null,
              completion_comment: comment || null
            }
          : resource
      ));

      setShowCompletionModal(false);
      setCompletionComment('');
      setSelectedResourceId(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Resources</h3>
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white p-3 rounded-md shadow-sm mb-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center">
                  <a
                    href={resource.url || resource.file_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-800 font-medium flex items-center"
                  >
                    {resource.url ? (
                      <LinkIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <Paperclip className="h-4 w-4 mr-2" />
                    )}
                    {resource.title}
                    {resource.file_name && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({resource.file_name})
                      </span>
                    )}
                  </a>
                  {resource.completed && (
                    <span className="ml-2 text-green-600 flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </span>
                  )}
                </div>
                {resource.description && (
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                )}
                {resource.completion_comment && (
                  <p className="text-sm text-gray-600 mt-1 italic">
                    "{resource.completion_comment}"
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {user?.role === 'mentee' && (
                  <button
                    onClick={() => handleToggleCompletion(resource.id, resource.completed)}
                    className={`p-1 rounded-full transition-colors ${
                      resource.completed
                        ? 'text-green-600 hover:text-green-700 bg-green-50'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title={resource.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
                {user?.role === 'mentor' && user?.profileId === resource.author_id && (
                  <button
                    onClick={() => handleDeleteResource(resource.id, resource.file_url)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete resource"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {resources.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No resources have been added yet.
          </div>
        )}
        {user?.role === 'mentor' && (
          showResourceForm ? (
            <form onSubmit={handleSubmitResource} className="mt-4 space-y-3">
              <input
                type="text"
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                placeholder="Resource title"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={newResourceUrl}
                    onChange={handleUrlInput}
                    placeholder="Resource URL"
                    className="flex-1 px-3 py-2 border rounded-md"
                    disabled={!!selectedFile}
                  />
                  <span className="text-gray-500">or</span>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                      disabled={!!newResourceUrl}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`px-4 py-2 rounded-md cursor-pointer inline-flex items-center ${
                        selectedFile ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      {selectedFile ? 'File selected' : 'Choose file'}
                    </label>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {selectedFile && (
                  <p className="text-sm text-gray-500">
                    Selected file: {selectedFile.name}
                  </p>
                )}
              </div>
              <textarea
                value={newResourceDescription}
                onChange={(e) => setNewResourceDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 border rounded-md"
                rows={2}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowResourceForm(false);
                    setSelectedFile(null);
                    setNewResourceUrl('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || (!newResourceUrl && !selectedFile)}
                  className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Uploading ({uploadProgress}%)
                    </>
                  ) : (
                    'Add Resource'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowResourceForm(true)}
              className="mt-2 text-sm text-orange-600 hover:text-blue-800 flex items-center"
            >
              <Paperclip className="h-4 w-4 mr-1" />
              Add Resource
            </button>
          )
        )}
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add a completion comment (optional)
            </h3>
            <textarea
              value={completionComment}
              onChange={(e) => setCompletionComment(e.target.value)}
              placeholder="What did you learn from this resource? (optional)"
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowCompletionModal(false);
                  setCompletionComment('');
                  setSelectedResourceId(null);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedResourceId) {
                    updateResourceCompletion(selectedResourceId, true, completionComment);
                  }
                }}
                className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-blue-700"
              >
                Complete Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}