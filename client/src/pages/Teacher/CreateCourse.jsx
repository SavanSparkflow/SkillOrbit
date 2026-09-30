import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Sparkles,
  CheckCircle,
  X,
  FileImage,
  ClipboardPaste,
  ListPlus,
} from 'lucide-react';

const categories = [
  'Web Development',
  'Mobile Development',
  'Data Science & AI',
  'UI/UX Design',
  'Cloud & DevOps',
  'Cybersecurity',
  'Business & Marketing',
];

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

const presetThumbnails = [
  {
    title: 'MERN Fullstack',
    url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'AI & Python',
    url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'UI/UX & Figma',
    url: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Cloud & Docker',
    url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Mobile Apps',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
  },
];

const CreateCourse = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('All Levels');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);

  // Thumbnail State
  const [thumbnailType, setThumbnailType] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [thumbnail, setThumbnail] = useState(
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'
  );
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const [outcomes, setOutcomes] = useState(['Build fullstack apps from scratch']);
  const [submitting, setSubmitting] = useState(false);

  // File Upload Handler (Uploads to Cloudinary / Server Storage)
  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP, etc.)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB limit. Please upload a smaller image.');
      return;
    }

    setUploadedFileName(file.name);
    setUploadedFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    // Instant local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnail(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary / Server in background
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success && res.data.fileUrl) {
        setThumbnail(res.data.fileUrl);
      }
    } catch (err) {
      console.warn('Background image upload notice:', err.message);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const addOutcomeField = () => {
    setOutcomes([...outcomes, '']);
  };

  const updateOutcomeField = (index, value) => {
    const updated = [...outcomes];
    updated[index] = value;
    setOutcomes(updated);
  };

  const removeOutcomeField = (index) => {
    setOutcomes(outcomes.filter((_, i) => i !== index));
  };

  // Smart paste handler: Automatically splits multi-line / bulleted pasted text into separate rows!
  const handleOutcomePaste = (e, index) => {
    const pasteText = e.clipboardData.getData('text');
    if (!pasteText) return;

    // Check if text has newlines or multiple items
    const rawLines = pasteText
      .split(/\r?\n/)
      .map((line) =>
        line
          .replace(/^[\s\t]*([0-9]+[.)\]\-:]+|[•\-\*–—\>])\s*/, '') // Remove bullet points and numbering (e.g. "1. ", "- ", "• ")
          .trim()
      )
      .filter((line) => line.length > 0);

    if (rawLines.length > 1) {
      e.preventDefault();
      const before = outcomes.slice(0, index);
      const after = outcomes.slice(index + 1);
      const merged = [...before, ...rawLines, ...after];
      setOutcomes(merged);
    }
  };

  // Keydown handler: Pressing Enter creates a new row below
  const handleOutcomeKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const before = outcomes.slice(0, index + 1);
      const after = outcomes.slice(index + 1);
      setOutcomes([...before, '', ...after]);
    }
  };

  // Bulk Paste Text Modal State
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const handleApplyBulkOutcomes = (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const parsed = bulkText
      .split(/\r?\n/)
      .map((line) =>
        line
          .replace(/^[\s\t]*([0-9]+[.)\]\-:]+|[•\-\*–—\>])\s*/, '')
          .trim()
      )
      .filter((line) => line.length > 0);

    if (parsed.length > 0) {
      // If only single empty initial outcome, replace it, else append
      if (outcomes.length === 1 && !outcomes[0].trim()) {
        setOutcomes(parsed);
      } else {
        setOutcomes([...outcomes.filter((o) => o.trim()), ...parsed]);
      }
      setBulkText('');
      setBulkModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post('/courses', {
        title,
        subtitle,
        description,
        category,
        level,
        price: Number(price),
        originalPrice: Number(originalPrice) || Number(price) * 1.5,
        thumbnail,
        learningOutcomes: outcomes.filter((o) => o.trim()),
      });

      if (res.data.success) {
        // Redirect to Manage Curriculum for this new course
        navigate(`/teacher/curriculum/${res.data.course._id}`);
      }
    } catch (err) {
      alert(err.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/teacher')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <Badge variant="indigo">Step 1: Course Info</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Create New Master Course
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            General Information
          </h3>

          <Input
            label="Course Title *"
            placeholder="e.g. Full Stack MERN 2026: Master LMS & Cloud Deployment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Short Subtitle / Tagline"
            placeholder="e.g. Build enterprise-grade SaaS web applications from scratch"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Description *
            </label>
            <textarea
              rows="4"
              placeholder="Describe what students will learn in this course..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-slate-100 rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Pricing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Selling Price (₹) (0 for Free)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              label="Original Strike-through Price (₹)"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Course Thumbnail Image Upload Section */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Course Thumbnail Image
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload a cover image from your computer or choose from high-res presets.
              </p>
            </div>

            {/* Thumbnail Type Switcher Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setThumbnailType('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  thumbnailType === 'upload'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setThumbnailType('presets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  thumbnailType === 'presets'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Presets
              </button>
              <button
                type="button"
                onClick={() => setThumbnailType('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  thumbnailType === 'url'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Image URL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Upload / Input Control Area */}
            <div className="md:col-span-7 space-y-4">
              {thumbnailType === 'upload' && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    dragActive
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 hover:border-indigo-500 hover:bg-slate-100/50 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Click to Browse or Drag & Drop Cover Image
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Supports PNG, JPG, JPEG, WEBP (Max: 10MB)
                    </p>
                  </div>
                  <Button type="button" variant="secondary" size="sm" className="mt-1 pointer-events-none">
                    Select File from Device
                  </Button>
                </div>
              )}

              {thumbnailType === 'presets' && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Click a preset to apply as course thumbnail:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {presetThumbnails.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setThumbnail(preset.url);
                          setUploadedFileName('');
                        }}
                        className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-video ${
                          thumbnail === preset.url
                            ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                            : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                          <span className="text-[11px] font-bold text-white truncate">
                            {preset.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {thumbnailType === 'url' && (
                <div className="space-y-3">
                  <Input
                    label="Direct Image Web URL"
                    placeholder="https://images.unsplash.com/..."
                    value={thumbnail}
                    onChange={(e) => {
                      setThumbnail(e.target.value);
                      setUploadedFileName('');
                    }}
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Provide a direct link from Unsplash, Imgur, Cloudinary, AWS S3, etc.
                  </p>
                </div>
              )}

              {uploadedFileName && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold truncate max-w-[200px]">{uploadedFileName}</span>
                    <span className="text-[10px] text-slate-500">({uploadedFileSize})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFileName('');
                      setThumbnail('https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800');
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Live Preview Box */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Live Thumbnail Preview
              </label>
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 aspect-video relative shadow-md">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                    <FileImage className="w-8 h-8" />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant="indigo">{category}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                What Students Will Learn
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key takeaways and skills covered in this masterclass.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setBulkModalOpen(true)}
                className="text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
              >
                <ClipboardPaste className="w-3.5 h-3.5 mr-1" /> Bulk Paste Points
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addOutcomeField}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Row
              </Button>
            </div>
          </div>

          {/* Helper Hint */}
          <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <ListPlus className="w-4 h-4 flex-shrink-0 text-indigo-500" />
            <span>
              <strong>Smart Paste:</strong> Copy multiple bullet points (from ChatGPT, syllabus or notes) and paste directly into any row below — they will automatically split into individual separate rows!
            </span>
          </div>

          <div className="space-y-2.5">
            {outcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  placeholder={`e.g. Outcome #${idx + 1} (or paste multiple points here...)`}
                  value={outcome}
                  onChange={(e) => updateOutcomeField(idx, e.target.value)}
                  onPaste={(e) => handleOutcomePaste(e, idx)}
                  onKeyDown={(e) => handleOutcomeKeyDown(e, idx)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {outcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOutcomeField(idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/teacher')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="emerald" size="lg" loading={submitting}>
            Save & Continue to Curriculum →
          </Button>
        </div>
      </form>

      {/* Bulk Paste Modal */}
      <Modal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        title="📋 Bulk Paste Learning Outcomes"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleApplyBulkOutcomes} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Paste your list of points below (1 per line, bullets/numbers are auto-cleaned):
            </label>
            <textarea
              rows="8"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`1. Master Full Stack MERN architecture from scratch
2. Connect React 19 frontend with Express & MongoDB
3. Implement JWT token authentication and role management
4. Integrate Razorpay payment gateway & signature verification
5. Build custom video player with progress tracking`}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500">
              {bulkText.split(/\r?\n/).filter((l) => l.trim()).length} points detected
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setBulkModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="emerald" size="sm">
                Apply All Points
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CreateCourse;
