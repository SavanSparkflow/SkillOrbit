import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { useAuthStore } from '../../store/authStore';
import Button from '../common/Button';
import Badge from '../common/Badge';
import {
  Bell,
  Pin,
  Trash2,
  Send,
  Plus,
  Calendar,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';

const CourseAnnouncements = ({ courseId, isInstructor = false }) => {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [posting, setPosting] = useState(false);

  const fetchAnnouncements = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/announcements/course/${courseId}`);
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [courseId]);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setPosting(true);
      const res = await apiClient.post('/announcements', {
        courseId,
        title,
        content,
        isPinned,
      });
      setAnnouncements([res.data.announcement, ...announcements]);
      setTitle('');
      setContent('');
      setIsPinned(false);
      setIsPosting(false);
    } catch (err) {
      alert(err.message || 'Failed to post announcement');
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await apiClient.delete(`/announcements/${announcementId}`);
      setAnnouncements(announcements.filter((a) => a._id !== announcementId));
    } catch (err) {
      alert(err.message || 'Failed to delete announcement');
    }
  };

  const canPost = user?.role === 'teacher' || user?.role === 'admin' || isInstructor;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            Course Announcements ({announcements.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Stay updated with latest lectures, schedule notices, and resources from your instructor.
          </p>
        </div>

        {canPost && (
          <Button
            variant="emerald"
            size="sm"
            onClick={() => setIsPosting(!isPosting)}
          >
            {isPosting ? 'Close' : '+ New Announcement'}
          </Button>
        )}
      </div>

      {/* Post Form (Instructor / Admin only) */}
      {isPosting && canPost && (
        <form
          onSubmit={handleCreateAnnouncement}
          className="glass-panel p-5 rounded-2xl border border-emerald-500/40 bg-slate-900/90 space-y-4 shadow-xl"
        >
          <h4 className="text-sm font-bold text-white">Post Announcement to Enrolled Students</h4>

          <input
            type="text"
            placeholder="Announcement Subject / Headline..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-indigo-500"
            required
          />

          <textarea
            rows="3"
            placeholder="Write your announcement details, lecture updates, or live links..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-indigo-500"
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span>📌 Pin this announcement to top</span>
            </label>

            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsPosting(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="emerald" size="sm" loading={posting}>
                Publish
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading announcements...</div>
      ) : announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className={`glass-panel p-5 rounded-2xl border transition-all ${
                a.isPinned
                  ? 'border-indigo-500/40 bg-indigo-950/20 shadow-lg'
                  : 'border-slate-800 bg-slate-900/70 shadow-sm'
              } space-y-3`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      a.instructor?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
                    }
                    alt={a.instructor?.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{a.instructor?.name || 'Instructor'}</span>
                      <Badge variant="indigo" className="text-[9px] px-1.5 py-0 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" /> Instructor
                      </Badge>
                      {a.isPinned && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5 fill-current" /> Pinned
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {canPost && (
                  <button
                    onClick={() => handleDeleteAnnouncement(a._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h4 className="text-sm font-bold text-white pl-11">{a.title}</h4>
              <p className="text-xs sm:text-sm text-slate-300 pl-11 whitespace-pre-line leading-relaxed">
                {a.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3 glass-panel rounded-2xl border border-slate-800 bg-slate-900/40">
          <Bell className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No announcements yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your instructor will post schedule changes, new lectures, and important notices here.
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseAnnouncements;
