import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  PlayCircle,
  Video,
  Eye,
  CheckCircle,
  Lock,
  Upload,
  Link as LinkIcon,
  X,
  Sparkles,
  FileVideo,
  AlertCircle,
  Clock,
  HelpCircle,
  FileText,
  Paperclip,
  Check,
  Award,
} from 'lucide-react';

const sampleVideos = [
  {
    title: 'Full MERN Stack Architecture Demo',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596,
  },
  {
    title: 'React 19 & Next.js 15 Masterclass',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 653,
  },
  {
    title: 'Cloud DevOps & Docker Deployment',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 15,
  },
];

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0 mins';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins} mins`;
  return `${mins}m ${secs}s`;
};

const getVideoSourceLabel = (url) => {
  if (!url) return 'No Video';
  if (url.startsWith('/uploads/')) return 'Uploaded File (Local Server)';
  if (url.includes('cloudinary.com')) return 'Cloudinary Stream';
  if (url.includes('commondatastorage.googleapis.com')) return 'Google CDN Video';
  if (url.startsWith('blob:')) return 'Local Browser Preview';
  return 'External Stream';
};

const ManageCurriculum = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoInputRef = useRef(null);
  const editVideoInputRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chapter Modal
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');
  const [addingChapter, setAddingChapter] = useState(false);

  // Lesson Create Modal
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [targetChapterId, setTargetChapterId] = useState(null);
  const [videoSourceType, setVideoSourceType] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  );
  const [uploadedVideoName, setUploadedVideoName] = useState('');
  const [duration, setDuration] = useState(600);
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [resources, setResources] = useState([]);
  const [addingLesson, setAddingLesson] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Lesson Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editVideoSourceType, setEditVideoSourceType] = useState('upload');
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editUploadedVideoName, setEditUploadedVideoName] = useState('');
  const [editDuration, setEditDuration] = useState(600);
  const [editIsFreePreview, setEditIsFreePreview] = useState(false);
  const [editResources, setEditResources] = useState([]);
  const [updatingLesson, setUpdatingLesson] = useState(false);
  const [editUploadProgress, setEditUploadProgress] = useState(0);
  const [isEditUploading, setIsEditUploading] = useState(false);

  // Quiz Modal State
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizChapterId, setQuizChapterId] = useState(null);
  const [quizLessonId, setQuizLessonId] = useState(null);
  const [quizContextName, setQuizContextName] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [quizQuestions, setQuizQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: '',
    },
  ]);
  const [savingQuiz, setSavingQuiz] = useState(false);

  // Upload Video File to Server / Cloudinary Handler
  const uploadVideoToServer = async (file, isEdit = false) => {
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file (MP4, WEBM, MOV, MKV, etc.)');
      return;
    }

    if (isEdit) {
      setEditUploadedVideoName(file.name);
      setIsEditUploading(true);
      setEditUploadProgress(0);
    } else {
      setUploadedVideoName(file.name);
      setIsUploading(true);
      setUploadProgress(0);
    }

    // Auto-detect duration from video element
    const objectUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.src = objectUrl;
    tempVideo.onloadedmetadata = () => {
      if (tempVideo.duration) {
        const detectedSec = Math.round(tempVideo.duration);
        if (isEdit) {
          setEditDuration(detectedSec);
        } else {
          setDuration(detectedSec);
        }
      }
      URL.revokeObjectURL(objectUrl);
    };

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (isEdit) {
              setEditUploadProgress(percent);
            } else {
              setUploadProgress(percent);
            }
          }
        },
      });

      if (res.data.success && res.data.fileUrl) {
        if (isEdit) {
          setEditVideoUrl(res.data.fileUrl);
        } else {
          setVideoUrl(res.data.fileUrl);
        }
      }
    } catch (err) {
      console.error('Video upload failed:', err);
      alert('Upload notice: You can also use a direct URL or Preset video.');
    } finally {
      if (isEdit) {
        setIsEditUploading(false);
      } else {
        setIsUploading(false);
      }
    }
  };

  // Upload Resource File (PDF/Zip/Doc) Handler
  const handleResourceFileUpload = async (file, isEdit = false, resIndex) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success && res.data.fileUrl) {
        if (isEdit) {
          const updated = [...editResources];
          updated[resIndex] = {
            ...updated[resIndex],
            title: updated[resIndex].title || file.name,
            url: res.data.fileUrl,
            fileType: file.type.includes('pdf') ? 'pdf' : 'attachment',
          };
          setEditResources(updated);
        } else {
          const updated = [...resources];
          updated[resIndex] = {
            ...updated[resIndex],
            title: updated[resIndex].title || file.name,
            url: res.data.fileUrl,
            fileType: file.type.includes('pdf') ? 'pdf' : 'attachment',
          };
          setResources(updated);
        }
      }
    } catch (err) {
      alert('Failed to upload resource file: ' + err.message);
    }
  };

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [courseRes, quizRes] = await Promise.all([
        apiClient.get(`/courses/${courseId}`),
        apiClient.get(`/quizzes/course/${courseId}`).catch(() => ({ data: { quizzes: [] } })),
      ]);
      setCourse(courseRes.data.course);
      setQuizzes(quizRes.data.quizzes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  // Create Chapter
  const handleCreateChapter = async (e) => {
    e.preventDefault();
    if (!chapterTitle.trim()) return;
    try {
      setAddingChapter(true);
      await apiClient.post('/chapters', {
        title: chapterTitle,
        courseId,
      });
      setChapterTitle('');
      setChapterModalOpen(false);
      fetchCourseData();
    } catch (err) {
      alert(err.message || 'Failed to add chapter');
    } finally {
      setAddingChapter(false);
    }
  };

  // Delete Chapter
  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm('Delete this chapter and all its lessons?')) return;
    try {
      await apiClient.delete(`/chapters/${chapterId}`);
      fetchCourseData();
    } catch (err) {
      alert(err.message || 'Failed to delete chapter');
    }
  };

  // Open Create Lesson Modal
  const openAddLessonModal = (chapterId) => {
    setTargetChapterId(chapterId);
    setLessonTitle('');
    setLessonDesc('');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    setUploadedVideoName('');
    setDuration(600);
    setIsFreePreview(false);
    setResources([]);
    setVideoSourceType('upload');
    setUploadProgress(0);
    setLessonModalOpen(true);
  };

  // Create Lesson
  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !videoUrl.trim()) {
      alert('Please provide both lesson title and video');
      return;
    }
    try {
      setAddingLesson(true);
      await apiClient.post(`/chapters/${targetChapterId}/lessons`, {
        title: lessonTitle,
        description: lessonDesc,
        videoUrl,
        duration: Number(duration) || 300,
        isFreePreview,
        resources: resources.filter((r) => r.title.trim() && r.url.trim()),
      });
      setLessonModalOpen(false);
      fetchCourseData();
    } catch (err) {
      alert(err.message || 'Failed to add lesson');
    } finally {
      setAddingLesson(false);
    }
  };

  // Open Edit Lesson Modal
  const openEditLessonModal = (lesson) => {
    setEditingLesson(lesson);
    setEditTitle(lesson.title || '');
    setEditDesc(lesson.description || '');
    setEditVideoUrl(lesson.videoUrl || '');
    setEditDuration(lesson.duration || 300);
    setEditIsFreePreview(!!lesson.isFreePreview);
    setEditResources(lesson.resources || []);
    setEditUploadedVideoName('');
    setEditUploadProgress(0);

    if (lesson.videoUrl?.startsWith('/uploads/') || lesson.videoUrl?.includes('cloudinary.com')) {
      setEditVideoSourceType('upload');
    } else if (sampleVideos.some((s) => s.url === lesson.videoUrl)) {
      setEditVideoSourceType('presets');
    } else {
      setEditVideoSourceType('url');
    }

    setEditModalOpen(true);
  };

  // Update Lesson
  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editVideoUrl.trim()) {
      alert('Please provide both lesson title and video');
      return;
    }

    try {
      setUpdatingLesson(true);
      await apiClient.put(`/chapters/lessons/${editingLesson._id}`, {
        title: editTitle,
        description: editDesc,
        videoUrl: editVideoUrl,
        duration: Number(editDuration) || 300,
        isFreePreview: editIsFreePreview,
        resources: editResources.filter((r) => r.title.trim() && r.url.trim()),
      });
      setEditModalOpen(false);
      fetchCourseData();
    } catch (err) {
      alert(err.message || 'Failed to update lesson');
    } finally {
      setUpdatingLesson(false);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Remove this lesson?')) return;
    try {
      await apiClient.delete(`/chapters/lessons/${lessonId}`);
      fetchCourseData();
    } catch (err) {
      alert(err.message || 'Failed to delete lesson');
    }
  };

  // Open Chapter Quiz Modal
  const openQuizModal = (chapter, existingQuiz = null) => {
    setQuizLessonId(null);
    setQuizChapterId(chapter._id);
    setQuizContextName(`Chapter: ${chapter.title}`);
    if (existingQuiz) {
      setEditingQuiz(existingQuiz);
      setQuizTitle(existingQuiz.title || `${chapter.title} - Assessment`);
      setPassingScore(existingQuiz.passingScore || 70);
      setQuizQuestions(
        existingQuiz.questions?.length
          ? existingQuiz.questions
          : [
              {
                question: '',
                options: ['', '', '', ''],
                correctAnswerIndex: 0,
                explanation: '',
              },
            ]
      );
    } else {
      setEditingQuiz(null);
      setQuizTitle(`${chapter.title} - Assessment & Concept Check`);
      setPassingScore(70);
      setQuizQuestions([
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: '',
        },
      ]);
    }
    setQuizModalOpen(true);
  };

  // Open Lesson Quiz Modal
  const openLessonQuizModal = (lesson, chapterId) => {
    const existingQuiz = quizzes.find((q) => q.lessonId === lesson._id);
    setQuizLessonId(lesson._id);
    setQuizChapterId(chapterId || lesson.chapterId);
    setQuizContextName(`Lesson: ${lesson.title}`);
    if (existingQuiz) {
      setEditingQuiz(existingQuiz);
      setQuizTitle(existingQuiz.title || `${lesson.title} - MCQ Quiz`);
      setPassingScore(existingQuiz.passingScore || 70);
      setQuizQuestions(
        existingQuiz.questions?.length
          ? existingQuiz.questions
          : [
              {
                question: '',
                options: ['', '', '', ''],
                correctAnswerIndex: 0,
                explanation: '',
              },
            ]
      );
    } else {
      setEditingQuiz(null);
      setQuizTitle(`${lesson.title} - Practice MCQ Quiz`);
      setPassingScore(70);
      setQuizQuestions([
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: '',
        },
      ]);
    }
    setQuizModalOpen(true);
  };

  // Save / Update Quiz
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizTitle.trim()) {
      alert('Please enter a Quiz Title');
      return;
    }

    const validQuestions = quizQuestions.filter(
      (q) => q.question.trim() && q.options.filter((o) => o.trim()).length >= 2
    );

    if (!validQuestions.length) {
      alert('Please provide at least 1 question with minimum 2 valid options.');
      return;
    }

    try {
      setSavingQuiz(true);
      if (editingQuiz) {
        await apiClient.put(`/quizzes/${editingQuiz._id}`, {
          title: quizTitle,
          passingScore: Number(passingScore) || 70,
          questions: validQuestions,
          lessonId: quizLessonId || null,
          chapterId: quizChapterId || null,
        });
      } else {
        await apiClient.post('/quizzes', {
          title: quizTitle,
          courseId,
          chapterId: quizChapterId || null,
          lessonId: quizLessonId || null,
          passingScore: Number(passingScore) || 70,
          questions: validQuestions,
        });
      }
      setQuizModalOpen(false);
      fetchCourseData();
    } catch (err) {
      alert(err.message || 'Failed to save quiz');
    } finally {
      setSavingQuiz(false);
    }
  };

  // Delete Quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Delete this chapter MCQ assessment?')) return;
    try {
      await apiClient.delete(`/quizzes/${quizId}`);
      fetchCourseData();
    } catch (err) {
      alert(err.message || 'Failed to delete quiz');
    }
  };

  if (loading) return <Loading text="Loading course curriculum..." fullScreen />;
  if (!course) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/teacher"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <Badge variant="emerald" className="mb-1">Curriculum & Assessment Management</Badge>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate max-w-xl">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/courses/${course._id}`} target="_blank">
            <Button variant="secondary" size="sm">
              <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview Course Page
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setChapterModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add New Chapter
          </Button>
        </div>
      </div>

      {/* Chapters & Lessons Syllabus Tree */}
      <div className="space-y-6">
        {(course.chapters || []).map((chapter, chIdx) => {
          const chapterQuiz = quizzes.find(
            (q) => q.chapterId === chapter._id || q.courseId === course._id
          );

          return (
            <div
              key={chapter._id}
              className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 overflow-hidden shadow-sm"
            >
              {/* Chapter Header */}
              <div className="p-4 bg-slate-100/80 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                    {chIdx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{chapter.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {(chapter.lessons || []).length} Lessons
                      </span>
                      {chapterQuiz && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 font-semibold flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          MCQ Quiz ({chapterQuiz.questions?.length || 0} Questions)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Chapter MCQ Quiz Button */}
                  {chapterQuiz ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openQuizModal(chapter, chapterQuiz)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-200 dark:border-purple-500/30 transition-all flex items-center gap-1"
                        title="Edit Chapter MCQ Quiz"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> Edit Quiz
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(chapterQuiz._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openQuizModal(chapter)}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-200 dark:border-purple-500/30 transition-all flex items-center gap-1"
                      title="Add Multiple Choice Questions for this Chapter"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> + Add MCQ Quiz
                    </button>
                  )}

                  {/* Add Lesson Button */}
                  <button
                    onClick={() => openAddLessonModal(chapter._id)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:border-indigo-500/30 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Lesson
                  </button>

                  {/* Delete Chapter Button */}
                  <button
                    onClick={() => handleDeleteChapter(chapter._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Chapter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lessons Inside Chapter */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
                {(chapter.lessons || []).length > 0 ? (
                  chapter.lessons.map((lesson, lIdx) => (
                    <div
                      key={lesson._id}
                      className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/40 flex items-center justify-between text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <PlayCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {formatDuration(lesson.duration)}
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                              {getVideoSourceLabel(lesson.videoUrl)}
                            </span>
                            {(lesson.resources || []).length > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                <Paperclip className="w-2.5 h-2.5" />
                                {lesson.resources.length} {lesson.resources.length === 1 ? 'Resource' : 'Resources'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Lesson MCQ Quiz Button */}
                        {(() => {
                          const lessonQuiz = quizzes.find((q) => q.lessonId === lesson._id);
                          if (lessonQuiz) {
                            return (
                              <button
                                onClick={() => openLessonQuizModal(lesson, chapter._id)}
                                className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-200 dark:border-purple-500/30 transition-all flex items-center gap-1"
                                title="Edit Lesson MCQ Quiz"
                              >
                                <HelpCircle className="w-3 h-3" />
                                MCQ ({lessonQuiz.questions?.length || 0})
                              </button>
                            );
                          }
                          return (
                            <button
                              onClick={() => openLessonQuizModal(lesson, chapter._id)}
                              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-purple-600 hover:text-white border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1"
                              title="Add Lesson MCQ Quiz"
                            >
                              <HelpCircle className="w-3 h-3 text-purple-400" />
                              + MCQ
                            </button>
                          );
                        })()}

                        {lesson.isFreePreview ? (
                          <Badge variant="emerald" className="text-[10px]">
                            Free Preview
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}

                        {/* Edit Lesson & Resources Button */}
                        <button
                          onClick={() => openEditLessonModal(lesson)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                          title="Edit Lesson, Video & Resources"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Lesson Button */}
                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
                    No lessons added yet. Click "+ Add Lesson" to upload a video lecture and add study resources.
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {course.chapters?.length === 0 && (
          <div className="glass-panel text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No chapters yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click below to add Chapter 1 to this course.</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setChapterModalOpen(true)}
            >
              Add First Chapter
            </Button>
          </div>
        )}
      </div>

      {/* Add Chapter Modal */}
      <Modal
        isOpen={chapterModalOpen}
        onClose={() => setChapterModalOpen(false)}
        title="Add New Chapter / Section"
      >
        <form onSubmit={handleCreateChapter} className="space-y-4">
          <Input
            label="Chapter Title *"
            placeholder="e.g. Chapter 1: Introduction & Architecture"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setChapterModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="emerald" size="sm" loading={addingChapter}>
              Create Chapter
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Lesson Modal */}
      <Modal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title="Upload Video Lesson & Resources"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateLesson} className="space-y-4">
          <Input
            label="Lesson Title *"
            placeholder="e.g. 1.1 Project Setup & Express Architecture"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            required
          />

          {/* Video Source Tabs */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Video Lesson Source *
              </label>
              <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setVideoSourceType('upload')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    videoSourceType === 'upload'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3 inline mr-1" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setVideoSourceType('presets')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    videoSourceType === 'presets'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Samples
                </button>
                <button
                  type="button"
                  onClick={() => setVideoSourceType('url')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    videoSourceType === 'url'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3 inline mr-1" />
                  Direct URL
                </button>
              </div>
            </div>

            {videoSourceType === 'upload' && (
              <div
                onClick={() => !isUploading && videoInputRef.current?.click()}
                className={`border-2 border-dashed ${
                  isUploading
                    ? 'border-indigo-500 bg-indigo-500/5 cursor-wait'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer'
                } bg-slate-50 dark:bg-slate-950/50 rounded-xl p-5 text-center transition-all flex flex-col items-center justify-center gap-2`}
              >
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      uploadVideoToServer(e.target.files[0], false);
                    }
                  }}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isUploading ? 'Uploading Video to Cloudinary / Server...' : 'Click to select Video File from Computer'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    MP4, WebM, MKV, MOV (Uploads directly to Cloud CDN)
                  </p>
                </div>

                {isUploading && (
                  <div className="w-full max-w-xs mt-2 space-y-1">
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                      {uploadProgress}% Uploaded
                    </span>
                  </div>
                )}
              </div>
            )}

            {videoSourceType === 'presets' && (
              <div className="space-y-1.5">
                {sampleVideos.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setVideoUrl(sample.url);
                      setDuration(sample.duration);
                      setUploadedVideoName(sample.title);
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      videoUrl === sample.url
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    <span className="truncate max-w-[260px]">{sample.title}</span>
                    <span className="text-[10px] text-slate-500">{formatDuration(sample.duration)}</span>
                  </div>
                ))}
              </div>
            )}

            {videoSourceType === 'url' && (
              <Input
                placeholder="https://res.cloudinary.com/... or Google Storage URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
            )}

            {uploadedVideoName && !isUploading && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold truncate max-w-[280px] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  {uploadedVideoName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {formatDuration(duration)}
                </span>
              </div>
            )}
          </div>

          <Input
            label="Duration in Seconds"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Lesson Description (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="What this specific lesson demonstrates..."
              value={lessonDesc}
              onChange={(e) => setLessonDesc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-200 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Downloadable Resources & Study Attachments Section */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                Lesson Study Resources (PDFs, Source Code, Cheatsheets)
              </span>
              <button
                type="button"
                onClick={() => setResources([...resources, { title: '', url: '', fileType: 'link' }])}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + Add Resource
              </button>
            </div>

            {resources.map((res, rIdx) => (
              <div key={rIdx} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Title (e.g. Source Code Repo)"
                  value={res.title}
                  onChange={(e) => {
                    const updated = [...resources];
                    updated[rIdx].title = e.target.value;
                    setResources(updated);
                  }}
                  className="flex-1 bg-white dark:bg-slate-900 text-xs rounded-lg p-2 border border-slate-200 dark:border-slate-700"
                />
                <input
                  type="text"
                  placeholder="URL or Uploaded file link"
                  value={res.url}
                  onChange={(e) => {
                    const updated = [...resources];
                    updated[rIdx].url = e.target.value;
                    setResources(updated);
                  }}
                  className="flex-1 bg-white dark:bg-slate-900 text-xs rounded-lg p-2 border border-slate-200 dark:border-slate-700"
                />
                <label className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 cursor-pointer text-indigo-600 dark:text-indigo-300" title="Upload File (PDF/Zip)">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleResourceFileUpload(e.target.files[0], false, rIdx);
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setResources(resources.filter((_, i) => i !== rIdx))}
                  className="p-1.5 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFreePreview}
              onChange={(e) => setIsFreePreview(e.target.checked)}
              className="rounded bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Allow Free Public Preview (Sample Demo Lesson)</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setLessonModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              loading={addingLesson || isUploading}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading Video...' : 'Save & Add Lesson'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Lesson Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Lesson, Video & Resources"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleUpdateLesson} className="space-y-4">
          <Input
            label="Lesson Title *"
            placeholder="e.g. 1.1 Project Setup & Express Architecture"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />

          {/* Current Video Info */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileVideo className="w-4 h-4 text-indigo-500" /> Current Video
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
                {getVideoSourceLabel(editVideoUrl)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {editVideoUrl || 'No video assigned'}
            </p>
          </div>

          {/* Video Source Switcher */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Replace / Change Video
              </label>
              <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setEditVideoSourceType('upload')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    editVideoSourceType === 'upload'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3 inline mr-1" />
                  Upload New
                </button>
                <button
                  type="button"
                  onClick={() => setEditVideoSourceType('presets')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    editVideoSourceType === 'presets'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Samples
                </button>
                <button
                  type="button"
                  onClick={() => setEditVideoSourceType('url')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    editVideoSourceType === 'url'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3 inline mr-1" />
                  Direct URL
                </button>
              </div>
            </div>

            {editVideoSourceType === 'upload' && (
              <div
                onClick={() => !isEditUploading && editVideoInputRef.current?.click()}
                className={`border-2 border-dashed ${
                  isEditUploading
                    ? 'border-indigo-500 bg-indigo-500/5 cursor-wait'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer'
                } bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center gap-2`}
              >
                <input
                  ref={editVideoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      uploadVideoToServer(e.target.files[0], true);
                    }
                  }}
                  className="hidden"
                />
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isEditUploading ? 'Uploading Video to Cloudinary / Server...' : 'Click to Upload Replacement Video'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Duration will be automatically recalculated
                  </p>
                </div>

                {isEditUploading && (
                  <div className="w-full max-w-xs mt-2 space-y-1">
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-200"
                        style={{ width: `${editUploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                      {editUploadProgress}% Uploaded
                    </span>
                  </div>
                )}
              </div>
            )}

            {editVideoSourceType === 'presets' && (
              <div className="space-y-1.5">
                {sampleVideos.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setEditVideoUrl(sample.url);
                      setEditDuration(sample.duration);
                      setEditUploadedVideoName(sample.title);
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      editVideoUrl === sample.url
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    <span className="truncate max-w-[260px]">{sample.title}</span>
                    <span className="text-[10px] text-slate-500">{formatDuration(sample.duration)}</span>
                  </div>
                ))}
              </div>
            )}

            {editVideoSourceType === 'url' && (
              <Input
                placeholder="https://res.cloudinary.com/... or Google Storage URL"
                value={editVideoUrl}
                onChange={(e) => setEditVideoUrl(e.target.value)}
                required
              />
            )}

            {editUploadedVideoName && !isEditUploading && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold truncate max-w-[280px] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  {editUploadedVideoName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {formatDuration(editDuration)}
                </span>
              </div>
            )}
          </div>

          <Input
            label="Duration in Seconds"
            type="number"
            value={editDuration}
            onChange={(e) => setEditDuration(Number(e.target.value))}
          />

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Lesson Description (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="What this specific lesson demonstrates..."
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-200 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Edit Downloadable Resources & Attachments */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                Lesson Study Resources (PDFs, Source Code, Cheatsheets)
              </span>
              <button
                type="button"
                onClick={() => setEditResources([...editResources, { title: '', url: '', fileType: 'link' }])}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + Add Resource
              </button>
            </div>

            {editResources.map((res, rIdx) => (
              <div key={rIdx} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Title (e.g. Cheatsheet PDF)"
                  value={res.title}
                  onChange={(e) => {
                    const updated = [...editResources];
                    updated[rIdx].title = e.target.value;
                    setEditResources(updated);
                  }}
                  className="flex-1 bg-white dark:bg-slate-900 text-xs rounded-lg p-2 border border-slate-200 dark:border-slate-700"
                />
                <input
                  type="text"
                  placeholder="URL or Uploaded file link"
                  value={res.url}
                  onChange={(e) => {
                    const updated = [...editResources];
                    updated[rIdx].url = e.target.value;
                    setEditResources(updated);
                  }}
                  className="flex-1 bg-white dark:bg-slate-900 text-xs rounded-lg p-2 border border-slate-200 dark:border-slate-700"
                />
                <label className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 cursor-pointer text-indigo-600 dark:text-indigo-300" title="Upload File (PDF/Zip)">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleResourceFileUpload(e.target.files[0], true, rIdx);
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setEditResources(editResources.filter((_, i) => i !== rIdx))}
                  className="p-1.5 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={editIsFreePreview}
              onChange={(e) => setEditIsFreePreview(e.target.checked)}
              className="rounded bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Allow Free Public Preview (Sample Demo Lesson)</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              loading={updatingLesson || isEditUploading}
              disabled={isEditUploading}
            >
              {isEditUploading ? 'Uploading...' : 'Update Lesson'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MCQ Quiz Modal (Lesson or Chapter) */}
      <Modal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        title={
          editingQuiz
            ? `Edit MCQ Quiz — ${quizContextName}`
            : `Create MCQ Quiz — ${quizContextName}`
        }
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveQuiz} className="space-y-5 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Assessment Title *"
                placeholder="e.g. Chapter 1: Concept Mastery Assessment"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Passing Score (%)"
                type="number"
                min={10}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Questions Editor */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Multiple Choice Questions ({quizQuestions.length})
              </h4>
              <button
                type="button"
                onClick={() =>
                  setQuizQuestions([
                    ...quizQuestions,
                    {
                      question: '',
                      options: ['', '', '', ''],
                      correctAnswerIndex: 0,
                      explanation: '',
                    },
                  ])
                }
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Next Question
              </button>
            </div>

            {quizQuestions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                    Question #{qIdx + 1}
                  </span>
                  {quizQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== qIdx))}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remove Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <textarea
                  rows="2"
                  placeholder="Enter the question text here..."
                  value={q.question}
                  onChange={(e) => {
                    const updated = [...quizQuestions];
                    updated[qIdx].question = e.target.value;
                    setQuizQuestions(updated);
                  }}
                  className="w-full bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-200 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />

                {/* 4 Options with Radio to select correct answer */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Options (Select the radio button next to the Correct Answer):
                  </span>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct_${qIdx}`}
                        checked={q.correctAnswerIndex === optIdx}
                        onChange={() => {
                          const updated = [...quizQuestions];
                          updated[qIdx].correctAnswerIndex = optIdx;
                          setQuizQuestions(updated);
                        }}
                        className="text-emerald-600 focus:ring-emerald-500"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...quizQuestions];
                          updated[qIdx].options[optIdx] = e.target.value;
                          setQuizQuestions(updated);
                        }}
                        className={`flex-1 bg-white dark:bg-slate-900 text-xs rounded-lg p-2 border ${
                          q.correctAnswerIndex === optIdx
                            ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <input
                  type="text"
                  placeholder="Optional answer explanation shown after submission..."
                  value={q.explanation}
                  onChange={(e) => {
                    const updated = [...quizQuestions];
                    updated[qIdx].explanation = e.target.value;
                    setQuizQuestions(updated);
                  }}
                  className="w-full bg-white dark:bg-slate-900 text-xs rounded-lg p-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setQuizModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="emerald" size="sm" loading={savingQuiz}>
              {editingQuiz ? 'Update Assessment' : 'Save & Publish Assessment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCurriculum;
